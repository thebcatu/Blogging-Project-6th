from django.contrib import admin
from .models import Comment, Reaction

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('blog', 'user', 'content', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content',)

@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    list_display = ('blog', 'user', 'reaction_type')
    list_filter = ('reaction_type',)
