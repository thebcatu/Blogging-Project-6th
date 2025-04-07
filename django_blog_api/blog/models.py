from django.db import models
from categories.models import Category
from users.models import CustomUser
from django.utils.text import slugify
from markdown import markdown
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator

class Blog(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    content = models.TextField()
    content_html = models.TextField(blank=True)  # Store rendered HTML from markdown
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    file = models.FileField(upload_to='blog_files/', blank=True, null=True)
    tags = models.CharField(max_length=200, blank=True)  # simple comma-separated tags
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='blogs')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='blogs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        # Generate slug if not provided
        if not self.slug:
            base_slug = slugify(self.title)
            unique_id = str(uuid.uuid4())[:8]
            self.slug = f"{base_slug}-{unique_id}"
            
        # Convert markdown to HTML
        if self.content:
            self.content_html = markdown(self.content)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Rating(models.Model):
    blog = models.ForeignKey(Blog, related_name='ratings', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'blog')
        
    def __str__(self):
        return f"{self.user.username} rated {self.blog.title}: {self.score}"
