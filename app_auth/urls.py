from django.urls import path
from .views import LoginView, RestrictedView, RefreshTokenView, RegisterView



urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('restricted/', RestrictedView.as_view(), name='restricted'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('register/', RegisterView.as_view(), name='register'),
]