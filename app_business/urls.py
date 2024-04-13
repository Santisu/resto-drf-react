from django.urls import path
from .views import PlatosView, PrecioView, VentaVIew



urlpatterns = [
    path('platos/', PlatosView.as_view(), name='platos'),
    path('platos/<int:id>/', PlatosView.as_view(), name='platos'),
    path('platos/<int:plato_id>/precios/', PrecioView.as_view(), name='platos_precios'),
    path('ventas/', VentaVIew.as_view(), name='venta_nueva'),
    path('ventas/<int:id>/', VentaVIew.as_view(), name='venta_get'),
]