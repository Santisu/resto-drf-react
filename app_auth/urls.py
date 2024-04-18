from django.urls import path
from .views import LoginView, RestrictedView, RefreshTokenView, RegisterView



urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('restricted/', RestrictedView.as_view(), name='restricted'),
]