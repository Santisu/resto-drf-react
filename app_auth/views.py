from typing import Any
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .auth_service import AuthService

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs: Any) -> None:
        self.auth_service = AuthService()
        super().__init__(**kwargs)
        
    def post(self, request) -> JsonResponse:
        tokens = self.auth_service.login(request)
        return Response(tokens, status=200)
        
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs: Any) -> None:
        self.auth_service = AuthService()
        super().__init__(**kwargs)
    
    def post(self, request) -> JsonResponse:
        token = self.auth_service.refresh_token(request)
        return Response(token, status=200)


class RestrictedView(APIView):
    def get(self, request):
        return JsonResponse({
            'message': 'This is a restricted view.'
        })