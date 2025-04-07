"""
URL configuration for blog_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Import Swagger components
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from blog.views import BlogViewSet, RatingViewSet
from categories.views import CategoryViewSet
from comments.views import CommentViewSet, ReactionViewSet
from users.views import (UserViewSet, RegisterView, VerifyEmailView, 
                         PasswordResetRequestView, PasswordResetConfirmView,
                         ResendVerificationEmailView, LoginAfterVerificationView)
from analytics.views import ActivityLogViewSet, WriterDashboardView, AdminDashboardView
from bookmarks.views import BookmarkViewSet

# Create schema view for Swagger
schema_view = get_schema_view(
   openapi.Info(
      title="Advanced Blog API",
      default_version='v1',
      description="API documentation for the Advanced Blog API project",
      terms_of_service="https://www.example.com/terms/",
      contact=openapi.Contact(email="contact@example.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'blogs', BlogViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'reactions', ReactionViewSet)
router.register(r'users', UserViewSet)
router.register(r'activity', ActivityLogViewSet, basename='activity')
router.register(r'bookmarks', BookmarkViewSet, basename='bookmarks')
router.register(r'ratings', RatingViewSet, basename='ratings')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('api/auth/resend-verification/', ResendVerificationEmailView.as_view(), name='resend-verification'),
    path('api/auth/login-after-verification/', LoginAfterVerificationView.as_view(), name='login-after-verification'),
    path('api/auth/password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('api/auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Dashboard endpoints
    path('api/dashboard/writer/', WriterDashboardView.as_view(), name='writer-dashboard'),
    path('api/dashboard/admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # Swagger documentation URLs
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
