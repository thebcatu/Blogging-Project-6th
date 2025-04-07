from rest_framework import serializers
from .models import ActivityLog, BlogAnalytics
from users.serializers import UserSerializer

class ActivityLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    content_type_name = serializers.CharField(source='content_type.model', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'user_details', 'action_type', 'content_type_name', 
                  'object_id', 'timestamp', 'details']
        read_only_fields = fields

class BlogAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogAnalytics
        fields = ['blog_id', 'views', 'unique_visitors', 'avg_time_spent', 
                 'bounce_rate', 'updated_at']
        read_only_fields = fields
