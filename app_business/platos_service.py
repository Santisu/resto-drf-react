from typing import Any
from .models import Plato, PlatoCantidadPrecio, Boleta, RegistroVenta
from .serializers import PlatoResponseSerializer, CreatePlatoSerializer, PlatoCantidadPrecioSerializer, RegistroRequestSerializer, BoletaResponseSerializer, RegistroResponseSerializer
from exceptions.exceptions import NotFoundException, BadRequestException
from django.db import IntegrityError, transaction


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
    
    @transaction.atomic
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
    @transaction.atomic
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
            cantidad_precio = plato.platocantidadprecio_set.get(cantidad=serializer.validated_data['cantidad'])
            if "precio" in serializer.validated_data:
                cantidad_precio.precio = serializer.validated_data['precio']
            if "is_active" in serializer.validated_data:
                cantidad_precio.is_active = serializer.validated_data['is_active']
            cantidad_precio.save()
        except PlatoCantidadPrecio.DoesNotExist:
            return self.create_precio(request, plato_id)

        plato.refresh_from_db()        
        return map_to_plato_response(plato)


class VentaService():
    def __init__(self):
        pass
    
    @transaction.atomic
    def create_venta(self, request):
        suma_registros_sin_descuento = 0
        suma_descuentos = 0
        lista_registros = []
        serializer = RegistroRequestSerializer(data=request.data, many=True)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        print(serializer.validated_data)
        platos_ids = set(registro.get('plato_id') for registro in serializer.validated_data)
        platos = Plato.objects.prefetch_related('platocantidadprecio_set').filter(id__in=platos_ids)
        platos_dict = {plato.id: plato for plato in platos}
        print(platos_dict)
        # Crear la boleta
        boleta = Boleta(user=request.user)
        boleta.save()
        
        # Crear los registros de venta
        for registro in serializer.validated_data:
            plato_id = registro.get('plato_id')
            plato = platos_dict.get(plato_id)
            if not plato:
                raise NotFoundException(f"Plato con id {plato_id} no encontrado")
            total_sin_descuento = calcular_total_sin_descuento(plato, registro.get('cantidad'))
            descuento = calcular_descuento(plato, registro.get('cantidad'), total_sin_descuento)
            total_registro = total_sin_descuento - descuento
            lista_registros.append(RegistroVenta.objects.create(
                boleta=boleta,
                plato=plato,
                cantidad=registro.get('cantidad'),
                total_sin_descuento=total_sin_descuento,
                descuento=descuento,
                total_registro=total_registro,
                user=request.user
            ))
            suma_registros_sin_descuento += total_sin_descuento
            suma_descuentos += descuento
        
        # Actualizar la boleta
        boleta.total_sin_descuento = suma_registros_sin_descuento
        boleta.total_descuentos = suma_descuentos
        boleta.total_boleta = suma_registros_sin_descuento - suma_descuentos
        boleta.save()
        boleta_serializer = BoletaResponseSerializer(boleta)
        registros_serializer = RegistroResponseSerializer(lista_registros, many=True)
        return {
                "boleta": boleta_serializer.data,
                "registros": registros_serializer.data
            }
    

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
        
def calcular_descuento(plato, cantidad, total_sin_descuento) -> int:
    precios_cantidades = plato.platocantidadprecio_set.filter(is_active=True).order_by('-cantidad')
    total_con_descuento = 0
    for precio_cantidad in precios_cantidades:
        if precio_cantidad.is_active:
            while cantidad - precio_cantidad.cantidad >= 0:
                total_con_descuento += precio_cantidad.precio
                cantidad -= precio_cantidad.cantidad
    return total_sin_descuento - total_con_descuento

def calcular_total_sin_descuento(plato, cantidad) -> int:
    return plato.platocantidadprecio_set.get(cantidad=1).precio * cantidad

