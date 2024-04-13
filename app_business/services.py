from typing import Any
from .models import Plato, PlatoCantidadPrecio, BoletaGeneral, BoletaDetalle
from .serializers import PlatoUpdateSerializer, PlatoCreateSerializer, PlatoCantidadPrecioCreateSerializer, DetallesVentaSerializer, PlatoCantidadPrecioUpdateSerializer, VentaCreateSerializer, plato_response_dto, boleta_completa_response_dto
from exceptions.exceptions import NotFoundException, BadRequestException, ForbiddenException
from django.db import IntegrityError, transaction
from django.db.models import Prefetch

class PlatosService:
    def __init__(self):
        pass

    def retrieve_platos(self, request) -> list[dict[str, Any]]:
        platos = Plato.objects.prefetch_related(
            Prefetch('platocantidadprecio_set',
                     queryset=PlatoCantidadPrecio.objects.order_by('cantidad'))
        ).filter(user=request.user)
        return plato_response_dto(list(platos))
    
    def retrieve_plato_by_id(self, request, id) -> dict[str, dict[str, Any]]:
        plato = get_plato(request, id)
        return plato_response_dto(plato)

    @transaction.atomic
    def create_plato(self, request) -> dict[str, Any]:
        serializer = PlatoCreateSerializer(data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        precio_unitario = serializer.validated_data.pop('precio_unitario')
        plato = Plato.objects.create(**serializer.validated_data, user=request.user)
        precio = PlatoCantidadPrecio.objects.create(plato=plato, cantidad=1, precio=precio_unitario, user=request.user)
        return plato_response_dto(plato)

    def update_plato(self, request, id) -> dict[str, Any]:
        plato = get_plato(request, id)
        serializer = PlatoUpdateSerializer(plato, data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        plato = serializer.save()
        return plato_response_dto(plato)


class PrecioService():
    def __init__(self):
        pass

    @transaction.atomic
    def create_precio(self, request, plato_id):
        plato = get_plato(request, plato_id)

        serializer = PlatoCantidadPrecioCreateSerializer(data=request.data)
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
            raise BadRequestException(f"La cantidad <{precio_data['cantidad']}> del plato {plato.nombre} ya tiene un precio asignado")
        plato.refresh_from_db()
        return plato_response_dto(plato)

    @transaction.atomic
    def update_precio(self, request, plato_id):
        plato = get_plato(request, plato_id)

        serializer = PlatoCantidadPrecioUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            raise BadRequestException(serializer.errors)
        serializer_data = serializer.validated_data
        try:
            cantidad_precio = plato.platocantidadprecio_set.get(cantidad=serializer_data['cantidad'])
            if "precio" in serializer_data:
                cantidad_precio.precio = serializer_data['precio']
            if "is_active" in serializer_data:
                cantidad_precio.is_active = serializer_data['is_active']
            cantidad_precio.save()
            self.valor_unitario_exists_and_active(plato)
        except PlatoCantidadPrecio.DoesNotExist:
            return self.create_precio(request, plato_id)

        plato.refresh_from_db(fields=['platocantidadprecio_set'])
        return plato_response_dto(plato)

    def valor_unitario_exists_and_active(self, plato):
        try:
            valor_unitario = PlatoCantidadPrecio.objects.get(
                plato=plato, cantidad=1)
            if not valor_unitario.is_active:
                raise ForbiddenException("El valor unitario debe estar siempre activo")
            return True
        except PlatoCantidadPrecio.DoesNotExist:
            raise ForbiddenException("Debe existir un valor unitario para este plato")


class VentaService():
    def __init__(self):
        pass

    @transaction.atomic
    def create_venta(self, request):
        suma_registros_sin_descuento = 0
        suma_descuentos = 0
        detalle_boleta = []
        venta = VentaCreateSerializer(data=request.data)
        if not venta.is_valid():
            raise BadRequestException(venta.errors)
        detalles_venta = venta.validated_data["detalles"]
        is_pagada = venta.validated_data.get('pagada', False)
        platos_vendidos = self.get_platos_vendidos(detalles_venta)
        
        # Crear la boleta
        boleta_general = BoletaGeneral(user=request.user, pagada=is_pagada)
        boleta_general.save()

        # Crear los registros de venta
        for registro in detalles_venta:
            plato = platos_vendidos.get(registro.get('plato_id'))
            cantidad = registro.get('cantidad')
            total_sin_descuento = calcular_total_sin_descuento(plato, cantidad)
            descuento = calcular_descuento(plato, cantidad, total_sin_descuento)
            total_registro = total_sin_descuento - descuento
            detalle_boleta.append(BoletaDetalle.objects.create(
                boleta=boleta_general,
                plato=plato,
                cantidad=cantidad,
                total_sin_descuento=total_sin_descuento,
                descuento=descuento,
                total_registro=total_registro,
                user=request.user
            ))
            suma_registros_sin_descuento += total_sin_descuento
            suma_descuentos += descuento

        # Actualizar la boleta
        boleta_general.total_sin_descuento = suma_registros_sin_descuento
        boleta_general.total_descuentos = suma_descuentos
        boleta_general.total_boleta = suma_registros_sin_descuento - suma_descuentos
        boleta_general.save()
        
        boleta_response = boleta_completa_response_dto(boleta_general, detalle_boleta)
        return boleta_response
    
    def retrieve_venta(self, request, id):
        try:
            boleta = BoletaGeneral.objects.prefetch_related("boletadetalle_set").get(id=id, user=request.user)
        except BoletaGeneral.DoesNotExist:
            raise NotFoundException("Boleta no encontrada")
        return boleta_completa_response_dto(boleta)
    
    
    def get_platos_vendidos(self, detalles)-> dict:
        platos_ids = set(registro.get('plato_id') for registro in detalles)
        platos = Plato.objects.prefetch_related(
            Prefetch('platocantidadprecio_set',
                     queryset=PlatoCantidadPrecio.objects.order_by('cantidad'))
        ).filter(id__in=platos_ids)
        return {plato.id: plato for plato in platos}


def get_plato(request, id):
    try:
        plato = Plato.objects.prefetch_related(
            Prefetch('platocantidadprecio_set',
                     queryset=PlatoCantidadPrecio.objects.order_by('cantidad'))
        ).get(id=id, user=request.user)
    except Plato.DoesNotExist:
        raise NotFoundException("Plato no encontrado")
    return plato


def calcular_descuento(plato, cantidad, total_sin_descuento) -> int:
    precios_cantidades = plato.platocantidadprecio_set.filter(
        is_active=True).order_by('-cantidad')
    total_con_descuento = 0
    for precio_cantidad in precios_cantidades:
        if precio_cantidad.is_active:
            while cantidad - precio_cantidad.cantidad >= 0:
                total_con_descuento += precio_cantidad.precio
                cantidad -= precio_cantidad.cantidad
    return total_sin_descuento - total_con_descuento

def calcular_total_sin_descuento(plato, cantidad) -> int:
    return plato.platocantidadprecio_set.get(cantidad=1).precio * cantidad
