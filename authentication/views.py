"""Authentication views for registration, login, OTP verification, and password reset"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .tokens import CustomRefreshToken

from .serializers import (
    RegisterSerializer, OTPVerifySerializer, LoginSerializer,
    UserProfileSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    ChangePasswordSerializer
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
        
        # Generate JWT tokens for automatic login
        refresh = CustomRefreshToken.for_user(user)
        
        return Response({
            "message": "Email verified successfully. You can now log in.",
            "email": user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Use custom token to include user_type and email in payload
        refresh = CustomRefreshToken.for_user(user)
        
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
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
    """Request password reset - sends OTP to email and returns a reset token"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        import jwt
        from datetime import timedelta
        from django.utils import timezone
        from django.conf import settings
        
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Delete old OTPs
        user.otps.all().delete()
        
        # Send OTP
        try:
            send_otp_email(user)
            
            # Generate JWT token for OTP verification
            payload = {
                'user_id': str(user.id),
                'purpose': 'password_reset',
                'exp': timezone.now() + timedelta(minutes=15),
                'iat': timezone.now()
            }
            reset_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            
            return Response({
                "message": "Password reset OTP sent to your email",
                "reset_token": reset_token
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": "Failed to send OTP"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyResetOtpView(APIView):
    """Verify OTP for password reset - returns a new token with password hash"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        import jwt
        import hashlib
        from datetime import timedelta
        from django.utils import timezone
        from django.conf import settings
        
        reset_token = request.data.get('reset_token')
        otp = request.data.get('otp')
        
        if not reset_token or not otp:
            return Response({
                "error": "Reset token and OTP are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify the initial reset token
            payload = jwt.decode(reset_token, settings.SECRET_KEY, algorithms=['HS256'])
            
            if payload.get('purpose') != 'password_reset':
                return Response({
                    "error": "Invalid token purpose"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(id=payload['user_id'], is_active=True)
        except (jwt.PyJWTError, User.DoesNotExist):
            return Response({
                "error": "Invalid or expired token"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify OTP
        try:
            otp_instance = user.otps.filter(otp=otp).latest('created_at')
            from core.utils import is_otp_valid
            
            if not is_otp_valid(otp_instance):
                return Response({
                    "error": "OTP has expired"
                }, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                "error": "Invalid OTP"
            }, status=status.HTTP_400_BAD_REQUEST)
        
       # Generate password fingerprint for security
        password_fingerprint = hashlib.sha256(user.password.encode()).hexdigest()[:12]
        
        # Create new token with password hash
        new_payload = {
            'user_id': str(user.id),
            'purpose': 'password_reset_confirmed',
            'security_hash': password_fingerprint,
            'exp': timezone.now() + timedelta(minutes=15),
            'iat': timezone.now()
        }
        new_reset_token = jwt.encode(new_payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Delete the used OTP
        otp_instance.delete()
        
        return Response({
            "message": "OTP verified successfully",
            "reset_token": new_reset_token
        }, status=status.HTTP_200_OK)


class SetNewPasswordView(APIView):
    """Set new password using verified reset token"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        import jwt
        import hashlib
        from django.conf import settings
        
        reset_token = request.data.get('reset_token')
        new_password = request.data.get('new_password')
        
        if not reset_token or not new_password:
            return Response({
                "error": "Reset token and new password are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify the token
            payload = jwt.decode(reset_token, settings.SECRET_KEY, algorithms=['HS256'])
            
            if payload.get('purpose') != 'password_reset_confirmed':
                return Response({
                    "error": "Invalid token purpose"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(id=payload['user_id'], is_active=True)
            
            # Verify password hasn't changed since OTP verification
            current_fingerprint = hashlib.sha256(user.password.encode()).hexdigest()[:12]
            token_fingerprint = payload.get('security_hash')
            
            if token_fingerprint != current_fingerprint:
                return Response({
                    "error": "This reset link has already been used. Please request a new one."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(new_password)
            user.save()
            
            # Delete all remaining OTPs
            user.otps.all().delete()
            
            return Response({
                "message": "Password reset successful. You can now log in with your new password."
            }, status=status.HTTP_200_OK)
            
        except (jwt.PyJWTError, User.DoesNotExist):
            return Response({
                "error": "Invalid or expired token"
            }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """Change password for authenticated users"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Set the new password
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            "message": "Password changed successfully"
        }, status=status.HTTP_200_OK)