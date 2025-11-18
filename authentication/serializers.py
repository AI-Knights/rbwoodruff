from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import GeneralUser, ReferredUser, Employer, TrainingProvider, Agency  


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
    data = serializers.JSONField()
    class Meta:
        model = User
        fields = ["email", "full_name", "user_type", "password", "data"]

    def create(self, validated_data):
        user_type = validated_data['user_type']
         
        if user_type == "general":
            user = GeneralUserSerializer(data=validated_data['data'])
        elif user_type == "agency_referred":
            user = ReferredUserSerializer(data=validated_data["data"])
        elif user_type == "employer":
            user = EmployerSerializer(data=validated_data["data"])
        elif user_type == "training_provider":
            user = TrainingProviderSerializer(data=validated_data["data"])
        elif user_type == "agency":
            user = AgencySerializer(data=validated_data["data"])
        else:
            raise serializers.ValidationError("Invalid user type")
        
        user.is_valid(raise_exception=True)

        print(user)