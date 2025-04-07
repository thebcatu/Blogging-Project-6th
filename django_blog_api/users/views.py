from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .tokens import account_activation_token, password_reset_token

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user or request.user.is_admin_user

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]
    throttle_classes = [UserRateThrottle]

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def writers(self, request):
        """Get all content writers"""
        writers = CustomUser.objects.filter(role='writer')
        page = self.paginate_queryset(writers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(writers, many=True)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    throttle_classes = [AnonRateThrottle]
    authentication_classes = []  # Explicitly set no authentication for registration
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            user.is_active = False  # Deactivate user until email is verified
            user.save()
            
            # Send email verification
            current_site = get_current_site(request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string('users/activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                'protocol': 'https' if request.is_secure() else 'http'
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            # Always send the email, regardless of debug mode
            email.send()
            
            return Response({
                "message": "User registered successfully. Check your email to activate your account.",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "status": "error",
                "code": "registration_failed",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('uidb64', openapi.IN_PATH, description="User ID encoded in base64", type=openapi.TYPE_STRING),
            openapi.Parameter('token', openapi.IN_PATH, description="Token for email verification", type=openapi.TYPE_STRING),
        ],
        responses={200: openapi.Response("Email verified successfully")}
    )
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None
            
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Activation link is invalid"}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer
    throttle_classes = [AnonRateThrottle]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        try:
            user = CustomUser.objects.get(email=email)
            
            try:
                # Send password reset email
                current_site = get_current_site(request)
                mail_subject = 'Reset your password.'
                message = render_to_string('users/password_reset_email.html', {
                    'user': user,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': password_reset_token.make_token(user),
                    'protocol': 'https' if request.is_secure() else 'http'
                })
                email = EmailMessage(mail_subject, message, to=[user.email])
                # Use try-except to capture email sending errors
                email.send()
            except Exception as e:
                print(f"Email sending error: {str(e)}")
                # Continue even if email sending fails (for development)
                
            return Response({"message": "Password reset instructions sent to your email"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            # Don't reveal that the user doesn't exist
            return Response({"message": "Password reset instructions sent to your email"}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer
    throttle_classes = [AnonRateThrottle]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get validated data from serializer
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None
            
        if user is not None and password_reset_token.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Password reset link is invalid"}, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    
    class ResendVerificationSerializer(serializers.Serializer):
        email = serializers.EmailField(required=True)
    
    serializer_class = ResendVerificationSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        try:
            user = CustomUser.objects.get(email=email, is_active=False)
            
            # Resend email verification
            current_site = get_current_site(request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string('users/activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                'protocol': 'https' if request.is_secure() else 'http'
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.send()
            
            return Response({
                "message": "Verification email resent successfully. Please check your email."
            }, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            # Don't reveal that the user doesn't exist
            return Response({
                "message": "If a user with this email exists and is not yet verified, a new verification email has been sent."
            }, status=status.HTTP_200_OK)

class LoginAfterVerificationView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    class LoginSerializer(serializers.Serializer):
        username = serializers.CharField(required=True)
        password = serializers.CharField(required=True, style={'input_type': 'password'})
    
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        from django.contrib.auth import authenticate
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.pk,
                    'username': user.username
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "Account not verified. Please check your email for verification link or request a new one.",
                    "requires_verification": True
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "error": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)
