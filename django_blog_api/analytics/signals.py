from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from blog.models import Blog
from comments.models import Comment, Reaction
from .models import ActivityLog

@receiver(post_save, sender=Blog)
def log_blog_activity(sender, instance, created, **kwargs):
    # Skip if no author (happens during migrations)
    if not hasattr(instance, 'author') or not instance.author:
        return
        
    action = 'create' if created else 'update'
    
    ActivityLog.objects.create(
        user=instance.author,
        action_type=action,
        content_type=ContentType.objects.get_for_model(instance),
        object_id=instance.id
    )

@receiver(post_delete, sender=Blog)
def log_blog_deletion(sender, instance, **kwargs):
    # Skip if no author (happens during migrations)
    if not hasattr(instance, 'author') or not instance.author:
        return
        
    ActivityLog.objects.create(
        user=instance.author,
        action_type='delete',
        content_type=ContentType.objects.get_for_model(instance),
        object_id=instance.id
    )

@receiver(post_save, sender=Comment)
def log_comment_activity(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action_type='comment',
            content_type=ContentType.objects.get_for_model(Blog),
            object_id=instance.blog.id,
            details={'comment_id': instance.id}
        )

@receiver(post_save, sender=Reaction)
def log_reaction_activity(sender, instance, created, **kwargs):
    # Only log new reactions, not updates
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action_type='reaction',
            content_type=ContentType.objects.get_for_model(Blog),
            object_id=instance.blog.id,
            details={'reaction_type': instance.reaction_type}
        )
