from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    blog_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'blog_count']
    
    def get_blog_count(self, obj):
        return obj.blog_set.count()
