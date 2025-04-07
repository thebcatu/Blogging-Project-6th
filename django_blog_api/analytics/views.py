from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import ActivityLog, BlogAnalytics
from .serializers import ActivityLogSerializer, BlogAnalyticsSerializer
from blog.models import Blog
from comments.models import Comment, Reaction

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_admin_user

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows activity logs to be viewed.
    """
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Check if this is a swagger schema generation request
        if getattr(self, 'swagger_fake_view', False):
            return ActivityLog.objects.none()
            
        user = self.request.user
        
        # Admin can see all logs
        if user.is_admin_user:
            return ActivityLog.objects.all()
        
        # Regular users can only see their own logs
        return ActivityLog.objects.filter(user=user)

class WriterDashboardView(generics.RetrieveAPIView):
    """
    Dashboard for writers showing their stats
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Get dashboard statistics for a writer",
        responses={200: openapi.Response(
            description="Writer dashboard data",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'total_blogs': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_views': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_reactions': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_comments': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'recent_activity': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'action_type': openapi.Schema(type=openapi.TYPE_STRING),
                                'timestamp': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                'details': openapi.Schema(type=openapi.TYPE_OBJECT),
                            }
                        )
                    ),
                }
            )
        )}
    )
    def get(self, request):
        user = request.user
        
        # Get basic stats
        blogs = Blog.objects.filter(author=user)
        blog_ids = blogs.values_list('id', flat=True)
        
        total_blogs = blogs.count()
        total_views = sum(blog.view_count for blog in blogs)
        total_reactions = Reaction.objects.filter(blog_id__in=blog_ids).count()
        total_comments = Comment.objects.filter(blog_id__in=blog_ids).count()
        
        # Get recent activity related to their blogs
        recent_activity = ActivityLog.objects.filter(
            content_type__model='blog',
            object_id__in=blog_ids
        ).exclude(
            user=user  # Exclude their own actions
        ).order_by('-timestamp')[:10]
        
        activity_data = [{
            'action_type': activity.action_type,
            'timestamp': activity.timestamp,
            'user': activity.user.username,
            'details': activity.details
        } for activity in recent_activity]
        
        return Response({
            'total_blogs': total_blogs,
            'total_views': total_views,
            'total_reactions': total_reactions,
            'total_comments': total_comments,
            'recent_activity': activity_data,
        })

class AdminDashboardView(generics.RetrieveAPIView):
    """
    Dashboard for admins showing overall site stats
    """
    permission_classes = [IsAdminUser]
    
    @swagger_auto_schema(
        operation_description="Get admin dashboard statistics",
        responses={200: openapi.Response(
            description="Admin dashboard data",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'total_users': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'active_users': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_blogs': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_comments': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_reactions': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'recent_blogs': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT)),
                    'top_authors': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT)),
                }
            )
        )}
    )
    def get(self, request):
        from users.models import CustomUser
        
        # Time windows
        now = timezone.now()
        last_month = now - timedelta(days=30)
        
        # User stats
        total_users = CustomUser.objects.count()
        active_users = ActivityLog.objects.filter(
            timestamp__gte=last_month
        ).values('user').distinct().count()
        
        # Content stats
        total_blogs = Blog.objects.count()
        total_comments = Comment.objects.count()
        total_reactions = Reaction.objects.count()
        
        # Recent blogs
        recent_blogs = Blog.objects.order_by('-created_at')[:5]
        recent_blogs_data = [{
            'id': blog.id,
            'title': blog.title,
            'author': blog.author.username,
            'created_at': blog.created_at,
            'view_count': blog.view_count
        } for blog in recent_blogs]
        
        # Top authors
        top_authors = CustomUser.objects.annotate(
            blog_count=Count('blogs'),
            total_views=Sum('blogs__view_count')
        ).order_by('-total_views')[:5]
        
        top_authors_data = [{
            'id': author.id,
            'username': author.username,
            'blog_count': author.blog_count,
            'total_views': author.total_views or 0
        } for author in top_authors]
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'total_blogs': total_blogs,
            'total_comments': total_comments,
            'total_reactions': total_reactions,
            'recent_blogs': recent_blogs_data,
            'top_authors': top_authors_data,
        })
