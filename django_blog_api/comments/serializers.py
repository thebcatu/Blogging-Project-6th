from rest_framework import serializers
from .models import Comment, Reaction
from users.serializers import UserSerializer

class RecursiveCommentSerializer(serializers.Serializer):
    def to_representation(self, instance):
        serializer = CommentSerializer(instance, context=self.context)
        return serializer.data

class CommentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    replies = RecursiveCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'blog', 'user', 'user_details', 'parent', 'content', 'created_at', 'replies']
        read_only_fields = ['user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ReactionSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Reaction
        fields = ['id', 'blog', 'user', 'user_details', 'reaction_type']
        read_only_fields = ['user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Check if user already reacted to this blog and update instead
        try:
            reaction = Reaction.objects.get(
                blog=validated_data['blog'],
                user=validated_data['user']
            )
            reaction.reaction_type = validated_data['reaction_type']
            reaction.save()
            return reaction
        except Reaction.DoesNotExist:
            return super().create(validated_data)
