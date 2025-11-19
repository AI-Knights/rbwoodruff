from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import GeneralUser, ReferredUser, Employer, TrainingProvider, Agency  
from django.db import transaction
import logging



logger = logging.getLogger(__name__)


User = get_user_model() 



class GeneralUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralUser
        fields = ["phone_number"]

class ReferredUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=  ReferredUser
        fields = ["phone_number", "court_name", "case_name"]

class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = ["company_name", "office_location"]

class TrainingProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProvider
        fields = ["specialization", "experience", "skills", "bio"]

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ["agency_name", "agency_id", "address", "documents"]



class RegisterSerializer(serializers.ModelSerializer):
    data = serializers.JSONField(write_only=True)
    class Meta:
        model = User
        fields = ["email", "full_name", "user_type", "password", "data"]
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
            raise serializers.ValidationError("Internal error. Please try again later")
