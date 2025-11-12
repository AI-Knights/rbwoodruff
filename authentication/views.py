from rest_framework import APIView, generics
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny




class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    authentication_classes = AllowAny

    