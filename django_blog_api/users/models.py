from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('visitor', 'Visitor'),
        ('writer', 'Content Writer'),
        ('admin', 'Admin'),
    )
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='visitor',
        verbose_name=_('User Role')
    )
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    middle_name = models.CharField(max_length=150, blank=True)
    
    @property
    def is_writer(self):
        return self.role == 'writer' or self.role == 'admin'
    
    @property
    def is_admin_user(self):
        return self.role == 'admin'
        
    def __str__(self):
        return self.username
