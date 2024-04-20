from typing import Any
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import PlatosService, PrecioService, VentaService
from rest_framework.pagination import PageNumberPagination

class CommonPaginator(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

class PlatosView(APIView):    
    pagination_class = CommonPaginator
    
    def __init__(self, **kwargs: Any) -> None:
        self.platos_service = PlatosService()
        self.paginator = CommonPaginator()
        super().__init__(**kwargs)
        
    def get(self, request, plato_id: int = None):
        if plato_id:
            plato = self.platos_service.retrieve_plato_by_id(request, plato_id)
            return Response(plato, status=status.HTTP_200_OK)
        platos = self.platos_service.retrieve_platos(request)
        result_page = self.paginator.paginate_queryset(platos, request)
        return self.paginator.get_paginated_response(result_page)
        
    def post(self, request):
        plato = self.platos_service.create_plato(request, request.data)
        return Response(plato, status=status.HTTP_201_CREATED)
    
    def put(self, request, plato_id):
        plato = self.platos_service.update_plato(request, plato_id)
        return Response(plato, status=status.HTTP_200_OK)
    
    
class PrecioView(APIView):
    def __init__(self, **kwargs: Any) -> None:
        self.precio_service = PrecioService()
        super().__init__(**kwargs)
        
    def post(self, request, plato_id):
        plato_precios = self.precio_service.create_precio(request.user, request.data, plato_id)
        return Response(plato_precios, status=status.HTTP_201_CREATED)
    
    def put(self, request, plato_id):
        plato_precios = self.precio_service.update_precio(request.user, request.data, plato_id)
        return Response(plato_precios, status=status.HTTP_200_OK)
    
class VentaVIew(APIView):
    def __init__(self, **kwargs: Any) -> None:
        self.venta_service = VentaService()
        super().__init__(**kwargs)
        
    def post(self, request):
        venta = self.venta_service.create_venta(request)
        return Response(venta, status=status.HTTP_201_CREATED)
    
    def get(self, request, id):
        ventas = self.venta_service.retrieve_venta(request, id)
        return Response(ventas, status=status.HTTP_200_OK)
    
    def put(self, request, id):
        venta = self.venta_service.update_venta(request, id)
        return Response(venta, status=status.HTTP_200_OK)