from typing import Any
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .platos_service import PlatosService, PrecioService


class PlatosView(APIView):    
    def __init__(self, **kwargs: Any) -> None:
        self.platos_service = PlatosService()
        super().__init__(**kwargs)
        
    def get(self, request, id: int = None):
        if id:
            plato = self.platos_service.retrieve_plato_by_id(request, id)
            return Response(plato, status=status.HTTP_200_OK)
        platos = self.platos_service.retrieve_platos(request)
        return Response(platos, status=status.HTTP_200_OK)
    
    def post(self, request):
        plato = self.platos_service.create_plato(request)
        return Response(plato, status=status.HTTP_201_CREATED)
    
    def put(self, request, id):
        plato = self.platos_service.update_plato(request, id)
        return Response(plato, status=status.HTTP_200_OK)
    
    
class PrecioView(APIView):
    def __init__(self, **kwargs: Any) -> None:
        self.precio_service = PrecioService()
        super().__init__(**kwargs)
        
    def post(self, request, plato_id):
        plato_precios = self.precio_service.create_precio(request, plato_id)
        return Response(plato_precios, status=status.HTTP_201_CREATED)
    
    def put(self, request, plato_id):
        plato_precios = self.precio_service.update_precio(request, plato_id)
        return Response(plato_precios, status=status.HTTP_200_OK)