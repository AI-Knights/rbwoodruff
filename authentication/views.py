"""Authentication views for registration, login, OTP verification, and password reset"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer, OTPVerifySerializer, LoginSerializer,
    UserProfileSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from .email_service import send_otp_email, send_welcome_email
from authentication.models import OTP


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send OTP for email verification
        try:
            send_otp_email(user)
        except Exception as e:
            print(f"Error sending OTP email: {e}")
        
        return Response({
            "message": "Registration successful. Please check your email for verification code.",
            "email": user.email,
            "user_type": user.user_type
        }, status=status.HTTP_201_CREATED)


class SendOTPView(APIView):
    """Resend OTP to user email"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete old OTPs
        user.otps.all().delete()
        
        # Send new OTP
        try:
            send_otp_email(user)
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    """Verify OTP and activate user account"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        otp_instance = serializer.validated_data['otp_instance']
        
        # Activate user
        user.is_active = True
        user.save()
        
        # Delete used OTP
        otp_instance.delete()
        
        # Send welcome email
        try:
            send_welcome_email(user)
        except:
            pass
        
        return Response({
            "message": "Email verified successfully. You can now log in.",
            "email": user.email
        }, status=status.HTTP_200_OK)


class LoginView(APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "Login successful",
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "user_type": user.user_type,
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """User logout - blacklist refresh token"""
    permission_classes =[IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class PasswordResetRequestView(APIView):
    """Request password reset - sends OTP to email"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Delete old OTPs
        user.otps.all().delete()
        
        # Send OTP
        try:
            send_otp_email(user)
            return Response({
                "message": "Password reset OTP sent to your email"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": "Failed to send OTP"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetConfirmView(APIView):
    """Confirm password reset with OTP and set new password"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        new_password = serializer.validated_data['new_password']
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        # Delete all OTPs
        user.otps.all().delete()
        
        return Response({
            "message": "Password reset successful. You can now log in with your new password."
        }, status=status.HTTP_200_OK)