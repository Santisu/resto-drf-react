from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from exceptions.exceptions import BadRequestException


class AuthService():
    def register(self, request) -> dict:
        pass
    
    def login(self, request) -> dict:
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
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
