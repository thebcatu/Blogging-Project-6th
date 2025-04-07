from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.db.models import Count, F, Q
from django.db.models.functions import Lower
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

from .models import Blog, Rating
from .serializers import BlogSerializer, BlogDetailSerializer, RatingSerializer
from .tasks import update_blog_search_vector

class IsWriterOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_writer

class IsAuthorOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Allow author and admin to edit
        return (obj.author == request.user) or request.user.is_admin_user

class BlogPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class BlogViewSet(viewsets.ModelViewSet):
    """
    Blog API endpoints
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsWriterOrReadOnly, IsAuthorOrAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'title', 'view_count']
    pagination_class = BlogPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def get_queryset(self):
        queryset = Blog.objects.all()
        # Only show published blogs that are not scheduled for the future to public
        if not self.request.user.is_authenticated or not self.request.user.is_writer:
            queryset = queryset.filter(
                published=True
            ).filter(
                Q(scheduled_for__lte=timezone.now()) | Q(scheduled_for__isnull=True)
            )
        # Filter by category if requested
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        # Filter by tag if requested
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tags__icontains=tag)
        # Filter by author if requested
        author_id = self.request.query_params.get('author', None)
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        # Full-text search if q parameter is provided
        search_query = self.request.query_params.get('q', None)
        if search_query:
            # For MySQL, use simple LIKE queries instead of PostgreSQL's full-text search
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(content__icontains=search_query) | 
                Q(tags__icontains=search_query)
            )
        return queryset
            
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogDetailSerializer
        return BlogSerializer
            
    def retrieve(self, request, *args, **kwargs):
        """
        Get a specific blog post and increment view count
        """
        instance = self.get_object()
        # Increment view count
        instance.view_count = F('view_count') + 1
        instance.save(update_fields=['view_count'])
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('category', openapi.IN_QUERY, description="Filter by category ID", type=openapi.TYPE_INTEGER),
            openapi.Parameter('tag', openapi.IN_QUERY, description="Filter by tag", type=openapi.TYPE_STRING),
            openapi.Parameter('author', openapi.IN_QUERY, description="Filter by author ID", type=openapi.TYPE_INTEGER),
            openapi.Parameter('q', openapi.IN_QUERY, description="Full-text search query", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all blog posts with optional filtering by category, tag, author, or search query
        """
        return super().list(request, *args, **kwargs)
        
    def perform_create(self, serializer):
        """
        Save the blog and then update its search vector
        """
        blog = serializer.save(author=self.request.user)
        update_blog_search_vector(blog.id)
        
    def perform_update(self, serializer):
        """
        Update the blog and its search vector
        """
        blog = serializer.save()
        update_blog_search_vector(blog.id)
        
    @swagger_auto_schema(
        operation_description="Get recommended blogs based on user activity",
        responses={200: BlogSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Returns personalized blog recommendations for the user
        """
        # A simple recommendation system based on popular blogs
        recommended = Blog.objects.filter(
            published=True
        ).filter(
            Q(scheduled_for__lte=timezone.now()) | Q(scheduled_for__isnull=True)
        ).annotate(
            reaction_count=Count('reactions') + Count('comments') + F('view_count')/10
        ).order_by('-reaction_count')[:5]
        
        # If user is authenticated, personalize recommendations
        if request.user.is_authenticated:
            # Get user's reaction history
            user_reactions = request.user.reaction_set.all()
            if user_reactions.exists():
                # Get categories the user has reacted to
                categories = set(reaction.blog.category_id for reaction in user_reactions)
                # Include blogs from those categories
                category_blogs = Blog.objects.filter(
                    category_id__in=categories,
                    published=True
                ).filter(
                    Q(scheduled_for__lte=timezone.now()) | Q(scheduled_for__isnull=True)
                ).exclude(
                    reactions__user=request.user
                ).order_by('-created_at')[:3]
                
                # Combine recommendations
                recommended_list = list(recommended)
                for blog in category_blogs:
                    if blog not in recommended_list:
                        recommended_list.append(blog)
                recommended = recommended_list[:5]
                
        serializer = self.get_serializer(recommended, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """
        Get trending blogs based on views and reactions
        """
        trending = Blog.objects.filter(
            published=True
        ).filter(
            Q(scheduled_for__lte=timezone.now()) | Q(scheduled_for__isnull=True)
        ).annotate(
            engagement=Count('reactions') + F('view_count')/10
        ).order_by('-engagement')[:10]
        
        serializer = self.get_serializer(trending, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def tags(self, request):
        """
        Get popular tags from blogs
        """
        # This is a simple implementation that assumes tags are comma-separated
        all_blogs = Blog.objects.filter(published=True)
        tag_counts = {}
        
        for blog in all_blogs:
            if blog.tags:
                tags = [tag.strip() for tag in blog.tags.split(',')]
                for tag in tags:
                    if tag:
                        tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        # Sort tags by count
        sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
        return Response([{"tag": tag, "count": count} for tag, count in sorted_tags[:20]])
        
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_blogs(self, request):
        """
        Get blogs authored by the current user
        """
        blogs = Blog.objects.filter(author=request.user).order_by('-created_at')
        page = self.paginate_queryset(blogs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(blogs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, pk=None):
        """
        Rate a blog post
        """
        blog = self.get_object()
        user = request.user
        score = request.data.get('score', None)
        
        if score is None:
            return Response(
                {'error': 'Score is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            score = int(score)
            if score < 1 or score > 5:
                raise ValueError()
        except ValueError:
            return Response(
                {'error': 'Score must be an integer between 1 and 5'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rating, created = Rating.objects.update_or_create(
            blog=blog,
            user=user,
            defaults={'score': score}
        )
        
        return Response({'rating': score}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def rated(self, request):
        """
        Get blogs rated by the current user
        """
        user = request.user
        rated_blog_ids = Rating.objects.filter(user=user).values_list('blog_id', flat=True)
        blogs = Blog.objects.filter(id__in=rated_blog_ids)
        
        page = self.paginate_queryset(blogs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(blogs, many=True)
        return Response(serializer.data)

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by blog if requested
        blog_id = self.request.query_params.get('blog', None)
        if blog_id:
            queryset = queryset.filter(blog_id=blog_id)
        # Filter by user if requested
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
