from rest_framework import serializers
from .models import Bookmark
from blog.serializers import BlogSerializer

class BookmarkSerializer(serializers.ModelSerializer):
    blog_details = BlogSerializer(source='blog', read_only=True)
    
    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'blog', 'blog_details', 'created_at', 'notes']
        read_only_fields = ['user']

class BookmarkCreateSerializer(serializers.Serializer):
    blog_id = serializers.IntegerField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_blog_id(self, value):
        from blog.models import Blog
        try:
            Blog.objects.get(pk=value)
        except Blog.DoesNotExist:
            raise serializers.ValidationError("Blog does not exist")
        return value
