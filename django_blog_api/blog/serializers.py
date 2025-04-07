from rest_framework import serializers
from .models import Blog, Rating
from categories.models import Category
from users.serializers import UserSerializer
from comments.serializers import CommentSerializer, ReactionSerializer

def validate_file_size_and_type(file, max_size_mb=5, allowed_extensions=None):
    """Validate file size and type"""
    if file is None:
        return
    
    # Check file size
    if file.size > max_size_mb * 1024 * 1024:
        raise serializers.ValidationError(f"File size should not exceed {max_size_mb}MB")
    
    # Check file extension
    if allowed_extensions:
        import os
        ext = os.path.splitext(file.name)[1][1:].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported file extension. Allowed extensions: {', '.join(allowed_extensions)}"
            )

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'blog', 'user', 'score', 'created_at', 'updated_at']
        read_only_fields = ['user']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        try:
            # Try to get existing rating and update it
            rating = Rating.objects.get(
                blog=validated_data['blog'],
                user=validated_data['user']
            )
            rating.score = validated_data['score']
            rating.save()
            return rating
        except Rating.DoesNotExist:
            # Create new rating if none exists
            return super().create(validated_data)

class BlogSerializer(serializers.ModelSerializer):
    author_details = UserSerializer(source='author', read_only=True)
    reaction_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'content', 'image', 'file', 
            'tags', 'author', 'author_details', 'category', 
            'created_at', 'updated_at', 'published', 'scheduled_for',
            'view_count', 'reaction_count', 'comment_count', 'average_rating', 'rating_count'
        ]
        read_only_fields = ['author', 'view_count', 'slug']
    
    def get_reaction_count(self, obj):
        return obj.reactions.count()
        
    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if ratings.exists():
            return sum(r.score for r in ratings) / ratings.count()
        return 0
        
    def get_rating_count(self, obj):
        return obj.ratings.count()
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
        
    def validate_image(self, value):
        validate_file_size_and_type(
            value, 
            max_size_mb=5, 
            allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'webp']
        )
        return value
        
    def validate_file(self, value):
        validate_file_size_and_type(
            value, 
            max_size_mb=10, 
            allowed_extensions=['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx']
        )
        return value

class BlogDetailSerializer(BlogSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    content_html = serializers.ReadOnlyField()
    
    class Meta(BlogSerializer.Meta):
        fields = BlogSerializer.Meta.fields + ['comments', 'reactions', 'content_html']
