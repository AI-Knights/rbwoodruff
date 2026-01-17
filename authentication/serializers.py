from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from users.models import GeneralUser, ReferredUser, Employer, TrainingProvider, Agency  
from django.db import transaction
import logging



logger = logging.getLogger(__name__)


User = get_user_model() 



class GeneralUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralUser
        fields = ["phone_number"]  # phone_number is required

class ReferredUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferredUser
        fields = ["phone_number", "court_name", "case_id"]  # All required for court-referred users

class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ["company_name", "office_location", "industry"]  # company_name and office_location required

class TrainingProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProvider
        fields = ["specialization", "experience", "skills", "bio"]  # All required

class AgencySerializer(serializers.ModelSerializer):
    documents = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=True,
        help_text="Array of document objects with 'public_id' and 'url' fields"
    )
    
    class Meta:
        model = Agency
        fields = [
            "agency_name", "agency_id", "address", "representative_name",
            "documents"
        ]
        extra_kwargs = {
            'representative_name': {'required': False},  # Optional
        }
    
    def create(self, validated_data):
        # Extract documents and other preprocessed fields
        documents_data = validated_data.pop('documents', None)
        verification_documents = validated_data.pop('verification_documents', [])
        document_public_id = validated_data.pop('document_public_id', '')
        document_url = validated_data.pop('document_url', '')
        
        # Create the agency with all fields
        agency = Agency.objects.create(
            verification_documents=verification_documents,
            document_public_id=document_public_id,
            document_url=document_url,
            **validated_data
        )
        
        return agency



class RegisterSerializer(serializers.ModelSerializer):
    data = serializers.JSONField(write_only=True)
    class Meta:
        model = User
        fields = ["full_name", "email", "user_type", "password", "data"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user_type = validated_data['user_type']

        try:
            with transaction.atomic():

                user = User.objects.create_user(
                    full_name = validated_data['full_name'],
                    email = validated_data['email'],
                    password = validated_data['password'],
                    user_type = validated_data['user_type']
                )
                
                if user_type == "agency":
                    from core.utils import move_cloudinary_document
                    
                    documents = validated_data['data'].get('documents', [])
                    
                    if not documents or len(documents) == 0:
                        raise serializers.ValidationError("At least one document is required for agency registration")
                    
                    moved_documents = []
                    
                    try:
                        # Process all documents
                        for idx, doc in enumerate(documents):
                            public_id = doc.get('public_id')
                            url = doc.get('url')
                            
                            if not public_id or not url:
                                raise serializers.ValidationError(f"Document {idx + 1} is missing 'public_id' or 'url'")
                            
                            moved_doc = move_cloudinary_document(
                                public_id=public_id,
                                user_id=str(user.id),
                                document_type='verification'
                            )
                            
                            moved_documents.append({
                                'public_id': moved_doc['public_id'],
                                'url': moved_doc.get('secure_url') or moved_doc.get('url')
                            })
                        
                        # Store all documents in verification_documents
                        validated_data['data']['verification_documents'] = moved_documents
                        
                        # Set the first document as primary
                        validated_data['data']['document_public_id'] = moved_documents[0]['public_id']
                        validated_data['data']['document_url'] = moved_documents[0]['url']
                        
                    except serializers.ValidationError:
                        raise
                    except Exception as e:
                        logger.error(f"Failed to move documents for agency {user.email}: {e}")
                        raise serializers.ValidationError(f"Document upload failed: {str(e)}")
                
                if user_type == "general":
                    val = GeneralUserSerializer(data=validated_data['data'])
                elif user_type == "agency_referred":
                    val = ReferredUserSerializer(data=validated_data["data"])
                elif user_type == "employer":
                    val = EmployerSerializer(data=validated_data["data"])
                elif user_type == "training_provider":
                    val = TrainingProviderSerializer(data=validated_data["data"])
                elif user_type == "agency":
                    val = AgencySerializer(data=validated_data["data"])
                else:
                    raise serializers.ValidationError("Invalid user type")
                
                val.is_valid(raise_exception=True)

                val.save(user=user)
                
                return user
        except Exception as e:
            logger.error(e)
            raise serializers.ValidationError(e)


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    
    def validate(self, data):
        from authentication.models import OTP
        from core.utils import is_otp_valid
        
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        try:
            otp_instance = user.otps.filter(otp=data['otp']).latest('created_at')
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")
        
        if not is_otp_valid(otp_instance):
            raise serializers.ValidationError("OTP has expired")
        
        data['user'] = user
        data['otp_instance'] = otp_instance
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError("Email and password are required")
        
        user = authenticate(username=email, password=password)
        
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise serializers.ValidationError("Account not activated. Please verify your email.")
        
        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for retrieving and updating user profile information"""
    has_paid = serializers.SerializerMethodField()
    profile_data = serializers.SerializerMethodField()
    profile_pic = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'user_type', 'profile_pic', 'phone_number', 'date_joined', 'has_paid', 'profile_data']
        read_only_fields = ['id', 'email', 'user_type', 'date_joined', 'has_paid', 'profile_data']
    
    def validate_email(self, value):
        """Prevent email from being updated"""
        if self.instance and self.instance.email != value:
            raise serializers.ValidationError("Email cannot be updated")
        return value
    
    def validate_profile_pic(self, value):
        """Validate base64 image data"""
        if not value:
            return value
        
        # Check if it's a base64 string
        if isinstance(value, str) and value.startswith('data:image'):
            import re
            # Validate base64 format: data:image/[format];base64,[data]
            pattern = r'^data:image/(jpeg|jpg|png|gif|webp|bmp);base64,[A-Za-z0-9+/=]+$'
            if not re.match(pattern, value, re.IGNORECASE):
                raise serializers.ValidationError(
                    "Invalid base64 image format. Expected: data:image/[jpeg|png|gif|webp];base64,[data]"
                )
        elif not isinstance(value, str):
            raise serializers.ValidationError("Profile picture must be a base64 encoded string")
        
        return value
    
    def to_internal_value(self, data):
        """Handle phone_number from input data for updates"""
        # Extract phone_number before validation since it's a SerializerMethodField
        self._phone_number_input = data.get('phone_number')
        return super().to_internal_value(data)
    
    def validate(self, data):
        """Validate phone_number from input"""
        # Add phone_number validation if it was provided in input
        if hasattr(self, '_phone_number_input') and self._phone_number_input is not None:
            phone_number = self._phone_number_input
            if isinstance(phone_number, str):
                phone_number = phone_number.strip()
                if not phone_number:
                    raise serializers.ValidationError({"phone_number": "Phone number cannot be empty"})
            data['phone_number'] = phone_number
        return data
    
    def update(self, instance, validated_data):
        """Handle profile update with base64 image upload to Cloudinary"""
        profile_pic_data = validated_data.pop('profile_pic', None)
        phone_number_data = validated_data.pop('phone_number', None)
        
        # Update basic fields (only full_name is writable)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        
        # Handle base64 image upload to Cloudinary
        if profile_pic_data:
            import cloudinary.uploader
            import base64
            import re
            from io import BytesIO
            
            try:
                # Extract base64 data
                if profile_pic_data.startswith('data:image'):
                    # Remove the data:image/[format];base64, prefix
                    base64_data = re.sub(r'^data:image/\w+;base64,', '', profile_pic_data)
                else:
                    base64_data = profile_pic_data
                
                # Decode base64 to bytes
                image_bytes = base64.b64decode(base64_data)
                
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_bytes,
                    folder=f"profile_pics/{instance.id}",
                    public_id=f"profile_{instance.id}",
                    overwrite=True,
                    resource_type="image",
                    transformation=[
                        {'width': 500, 'height': 500, 'crop': 'fill', 'gravity': 'face'},
                        {'quality': 'auto:good'},
                        {'fetch_format': 'auto'}
                    ]
                )
                
                # Set the Cloudinary URL
                instance.profile_pic = upload_result['secure_url']
                
            except base64.binascii.Error:
                raise serializers.ValidationError("Invalid base64 encoding")
            except Exception as e:
                logger.error(f"Failed to upload profile image for user {instance.id}: {str(e)}")
                raise serializers.ValidationError(f"Failed to upload image: {str(e)}")
        
        # Handle phone number update for job seekers
        if phone_number_data is not None:
            try:
                if instance.user_type == 'general':
                    profile = instance.general_profile
                    profile.phone_number = phone_number_data
                    profile.save()
                elif instance.user_type == 'agency_referred':
                    profile = instance.referred_profile
                    profile.phone_number = phone_number_data
                    profile.save()
                else:
                    # For other user types, phone number update is not applicable
                    raise serializers.ValidationError(
                        "Phone number update is only available for general and agency-referred users"
                    )
            except (GeneralUser.DoesNotExist, ReferredUser.DoesNotExist):
                raise serializers.ValidationError("User profile not found")
        
        instance.save()
        return instance
    
    def get_has_paid(self, obj):
        """Get payment status for job seekers"""
        try:
            if obj.user_type == 'general':
                return obj.general_profile.has_paid
            elif obj.user_type == 'agency_referred':
                return obj.referred_profile.has_paid
            else:
                # Non job-seeker roles don't need payment
                return None
        except:
            return False
    
    def get_phone_number(self, obj):
        """Get phone number from user's profile"""
        try:
            if obj.user_type == 'general':
                return obj.general_profile.phone_number
            elif obj.user_type == 'agency_referred':
                return obj.referred_profile.phone_number
            else:
                # Other user types don't have phone numbers
                return None
        except:
            return None
    
    def get_profile_data(self, obj):
        """Get user type specific profile information"""
        try:
            if obj.user_type == 'general':
                profile = obj.general_profile
                return {
                    'phone_number': profile.phone_number,
                    'resume_completeness': profile.resume_completeness
                }
            elif obj.user_type == 'agency_referred':
                profile = obj.referred_profile
                return {
                    'phone_number': profile.phone_number,
                    'court_name': profile.court_name,
                    'case_id': profile.case_id,
                    'resume_completeness': profile.resume_completeness
                }
            elif obj.user_type == 'employer':
                profile = obj.employer_profile
                return {
                    'company_name': profile.company_name,
                    'industry': profile.industry,
                    'office_location': profile.office_location,
                    'status': profile.status
                }
            elif obj.user_type == 'training_provider':
                profile = obj.trainer_profile
                return {
                    'specialization': profile.specialization,
                    'experience': profile.experience,
                    'status': profile.status,
                    'total_learners': profile.total_learners
                }
            elif obj.user_type == 'agency':
                profile = obj.agency_profile
                return {
                    'agency_name': profile.agency_name,
                    'agency_id': profile.agency_id,
                    'address': profile.address,
                    'status': profile.status,
                    'verification_documents': profile.verification_documents,
                    'document_public_id': profile.document_public_id,
                    'document_url': profile.document_url
                }
            return None
        except:
            return None


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        from authentication.models import OTP
        from core.utils import is_otp_valid
        
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        try:
            otp_instance = user.otps.filter(otp=data['otp']).latest('created_at')
        except OTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")
        
        if not is_otp_valid(otp_instance):
            raise serializers.ValidationError("OTP has expired")
        
        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for authenticated users to change their password"""
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    
    def validate_old_password(self, value):
        """Verify that the old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value
    
    def validate_new_password(self, value):
        """Ensure new password meets requirements"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return value
    
    def validate(self, data):
        """Ensure new password is different from old password"""
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError("New password must be different from old password")
        return data
