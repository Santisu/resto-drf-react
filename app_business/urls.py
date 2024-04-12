from django.urls import path
from .views import PlatosView, PrecioView



urlpatterns = [
    path('platos/', PlatosView.as_view(), name='platos'),
    path('platos/<int:id>/', PlatosView.as_view(), name='platos'),
    path('platos/<int:plato_id>/precios/', PrecioView.as_view(), name='platos_precios'),
]