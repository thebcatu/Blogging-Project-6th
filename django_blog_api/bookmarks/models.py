from django.db import models
from users.models import CustomUser
from blog.models import Blog

class Bookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookmarks')
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ('user', 'blog')
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.username} bookmarked {self.blog.title}"
