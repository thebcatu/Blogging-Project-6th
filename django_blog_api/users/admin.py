from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'middle_name', 'last_name', 'is_writer', 'is_admin_user')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('middle_name', 'bio', 'profile_picture')}),
        ('Custom Permissions', {'fields': ('is_writer', 'is_admin_user')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('middle_name', 'bio', 'profile_picture')}),
        ('Custom Permissions', {'fields': ('is_writer', 'is_admin_user')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
