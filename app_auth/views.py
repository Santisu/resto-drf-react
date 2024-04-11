from typing import Any
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from app_auth.serializers import UserSerializer
from .auth_service import AuthService

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs: Any) -> None:
        self.auth_service = AuthService()
        super().__init__(**kwargs)
        
    def post(self, request) -> JsonResponse:
        tokens = self.auth_service.login(request)
        return Response(tokens, status=status.HTTP_202_ACCEPTED)
        
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs: Any) -> None:
        self.auth_service = AuthService()
        super().__init__(**kwargs)
    
    def post(self, request) -> JsonResponse:
        token = self.auth_service.refresh_token(request)
        return Response(token, status=status.HTTP_200_OK)
    
    
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs: Any) -> None:
        self.auth_service = AuthService()
        super().__init__(**kwargs)
    
    def post(self, request):
        new_user = self.auth_service.register(request)
        return Response(new_user, status=status.HTTP_201_CREATED)


class RestrictedView(APIView):
    def get(self, request):
        return JsonResponse({
            'message': 'This is a restricted view.'
        })