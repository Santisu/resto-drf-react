from typing import Any
from .models import Plato, PlatoCantidadPrecio
from .serializers import PlatoResponseSerializer, CreatePlatoSerializer, PlatoCantidadPrecioSerializer
from exceptions.exceptions import NotFoundException, BadRequestException
from django.db import IntegrityError


class PlatosService:
    def __init__(self):
        pass

    def retrieve_platos(self, request) -> list[dict[str, Any]]:
        platos = Plato.objects.prefetch_related(
            'platocantidadprecio_set').filter(user=request.user)
        platos_list = []
        for plato in platos:
            platos_list.append(map_to_plato_response(plato))
        return platos_list

    def retrieve_plato_by_id(self, request, id) -> dict[str, dict[str, Any]]:
        plato = get_plato(request, id)
        return map_to_plato_response(plato)

    def create_plato(self, request) -> dict[str, Any]:
        serializer = CreatePlatoSerializer(data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        precio_unitario = serializer.validated_data.pop('precio_unitario')
        plato = Plato.objects.create(
            **serializer.validated_data, user=request.user)
        precio = PlatoCantidadPrecio.objects.create(
            plato=plato, cantidad=1, precio=precio_unitario, user=request.user)
        return map_to_plato_response(plato)

    def update_plato(self, request, id) -> dict[str, Any]:
        plato = get_plato(request, id)
        serializer = PlatoResponseSerializer(plato, data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        plato = serializer.save()
        return map_to_plato_response(plato)    
        
        
class PrecioService():
    def __init__(self):
        pass
    
    def create_precio(self, request, plato_id):
        plato = get_plato(request, plato_id)
        
        serializer = PlatoCantidadPrecioSerializer(data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        
        precio_data = serializer.validated_data
        try:
            PlatoCantidadPrecio.objects.create(
                plato=plato,
                user=request.user,
                **precio_data
            )
        except IntegrityError:
            raise BadRequestException("Ya existe un precio para esta cantidad de plato")
        plato.refresh_from_db()
        return map_to_plato_response(plato)
    
    def update_precio(self, request, plato_id):
        plato = get_plato(request, plato_id)
        
        serializer = PlatoCantidadPrecioSerializer(data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        
        try:
            cantidad_precio = plato.platocantidadprecio_set.get(cantidad=request.data['cantidad'])
            if request.data.get('precio', None):
                cantidad_precio.precio = request.data['precio']
            if request.data.get('is_active', None):
                cantidad_precio.is_active = request.data['is_active']
            cantidad_precio.save()
        except PlatoCantidadPrecio.DoesNotExist:
            return self.create_precio(request, plato_id)

        plato.refresh_from_db()        
        return map_to_plato_response(plato)

def get_plato(request, id):
    try:
        plato = Plato.objects.prefetch_related(
            'platocantidadprecio_set').get(id=id, user=request.user)
    except Plato.DoesNotExist:
        raise NotFoundException("Plato no encontrado")
    return plato

def map_to_plato_response(plato) -> dict[str, Any]:
        return {
            "plato": PlatoResponseSerializer(plato).data,
            "precios": PlatoCantidadPrecioSerializer(plato.platocantidadprecio_set.all(), many=True).data
        }