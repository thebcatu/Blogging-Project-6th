from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Comment, Reaction
from .serializers import CommentSerializer, ReactionSerializer

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or request.user.is_admin_user

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by blog if requested
        blog_id = self.request.query_params.get('blog', None)
        if blog_id:
            queryset = queryset.filter(blog_id=blog_id)
            
        # Only return top-level comments if 'root_only' is specified
        root_only = self.request.query_params.get('root_only', False)
        if root_only:
            queryset = queryset.filter(parent=None)
            
        return queryset

class ReactionViewSet(viewsets.ModelViewSet):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by blog if requested
        blog_id = self.request.query_params.get('blog', None)
        if blog_id:
            queryset = queryset.filter(blog_id=blog_id)
        return queryset
