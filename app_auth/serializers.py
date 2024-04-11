from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)
    class Meta:
        model = User
        fields = ['id','email','first_name', 'last_name', 'is_active', 'password']

class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ['email', 'password']