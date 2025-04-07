from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Bookmark
from .serializers import BookmarkSerializer, BookmarkCreateSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class BookmarkViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing bookmarks
    """
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BookmarkCreateSerializer
        return BookmarkSerializer
    
    def get_queryset(self):
        # Check if this is a swagger schema generation request
        if getattr(self, 'swagger_fake_view', False):
            return Bookmark.objects.none()
            
        # Users can only see their own bookmarks
        return Bookmark.objects.filter(user=self.request.user)
    
    @swagger_auto_schema(
        operation_description="Toggle bookmark status for a blog",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'blog_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'notes': openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
            },
            required=['blog_id']
        ),
        responses={
            201: openapi.Response("Bookmark created", BookmarkSerializer),
            200: openapi.Response("Bookmark deleted", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )),
            400: "Bad request",
        }
    )
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        blog_id = serializer.validated_data['blog_id']
        notes = serializer.validated_data.get('notes', '')
        
        # Check if bookmark exists
        existing = Bookmark.objects.filter(user=request.user, blog_id=blog_id).first()
        
        if existing:
            # If it exists, delete it (toggle off)
            existing.delete()
            return Response({'message': 'Bookmark removed'}, status=status.HTTP_200_OK)
        else:
            # If it doesn't exist, create it (toggle on)
            bookmark = Bookmark.objects.create(
                user=request.user,
                blog_id=blog_id,
                notes=notes
            )
            return Response(BookmarkSerializer(bookmark).data, status=status.HTTP_201_CREATED)
