from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from app_auth.serializers import UserSerializer, UserRegisterSerializer
from exceptions.exceptions import BadRequestException
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthService():
    def register(self, request) -> dict:
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        password = serializer.validated_data['password']
        email = serializer.validated_data['email']
        if User.objects.filter(email=email).exists():
            raise BadRequestException({"email": ["Este correo electrónico ya está registrado."]})
        try:
            validate_password(password)
        except ValidationError as e:
            raise BadRequestException(e.messages)
        user = User.objects.create_user(email=email, password=password)
        new_user = UserSerializer(user)
        return new_user.data
    
    def login(self, request) -> dict:
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            raise BadRequestException('Usuario o contraseña inválidos')
        refresh = RefreshToken.for_user(user)
        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }
        
    def refresh_token(self, request) -> dict:
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            raise BadRequestException('refresh_token no proporcionado')
        try:
            refresh_token = RefreshToken(refresh_token)
            access_token = str(refresh_token.access_token)
            return {'access_token': access_token}
        except Exception as e:
            raise BadRequestException('refresh_token inválido o expirado')
