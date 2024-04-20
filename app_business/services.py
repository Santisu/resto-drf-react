from typing import Any
from .models import Plato, PlatoCantidadPrecio, BoletaGeneral, BoletaDetalle
from .serializers import PlatoUpdateSerializer, PlatoCreateSerializer, PlatoCantidadPrecioCreateSerializer, PlatoCantidadPrecioUpdateSerializer, VentaCreateSerializer, VentaUpdateSerializer, plato_response_dto, boleta_completa_response_dto
from exceptions.exceptions import DomainExceptions
from django.db import IntegrityError, transaction
from django.db.models import Prefetch

class PlatosService:
    def __init__(self):
        self.precio_service = PrecioService()
        pass

    def retrieve_platos(self, request) -> list[dict[str, Any]]:
        platos = Plato.objects.prefetch_related(
            Prefetch('platocantidadprecio_set',
                     queryset=PlatoCantidadPrecio.objects.order_by('cantidad'))
        ).filter(user=request.user).order_by('-is_active', 'nombre')
        return plato_response_dto(list(platos))
    
    def retrieve_plato_by_id(self, request, id) -> dict[str, dict[str, Any]]:
        plato = get_plato(request.user, id)
        return plato_response_dto(plato)

    @transaction.atomic
    def create_plato(self, request, body: dict|list) -> dict[str, Any]:
        if type(body) is list:
            return map(lambda p: self.create_plato(request, p), body)
        serializer = PlatoCreateSerializer(data=body)
        if not serializer.is_valid():
            raise DomainExceptions.bad_request(serializer.errors)
        precio_unitario = serializer.validated_data.pop('precio_unitario')
        plato = Plato.objects.create(**serializer.validated_data, user=request.user)
        precio = PlatoCantidadPrecio.objects.create(plato=plato, cantidad=1, precio=precio_unitario, is_active=True, user=request.user)
        return plato_response_dto(plato)

    def update_plato(self, request, plato_id) -> dict[str, Any]:
        plato_to_be_update = get_plato(request.user, plato_id)
        updated_plato = request.data
        updated_precios = updated_plato.pop('precios', None)
        serializer = PlatoUpdateSerializer(plato_to_be_update, data=updated_plato)
        if not serializer.is_valid():
            raise DomainExceptions.bad_request(serializer.errors)
        plato_to_be_update = serializer.save()
        self.precio_service.update_precio(request.user, updated_precios, plato_id)
        return plato_response_dto(plato_to_be_update)


class PrecioService():
    def __init__(self):
        pass

    @transaction.atomic
    def create_precio(self, user, precio_request, plato_id):
        plato = get_plato(user, plato_id)

        serializer = PlatoCantidadPrecioCreateSerializer(data=precio_request)
        if not serializer.is_valid():
            raise DomainExceptions.bad_request(serializer.errors)

        precio_data = serializer.validated_data
        try:
            PlatoCantidadPrecio.objects.create(
                plato=plato,
                user=user,
                **precio_data
            )
        except IntegrityError:
            raise DomainExceptions.bad_request(f"La cantidad <{precio_data['cantidad']}> del plato {plato.nombre} ya tiene un precio asignado")
        plato.refresh_from_db()
        return plato_response_dto(plato)

    @transaction.atomic
    def update_precio(self, user, precio_request, plato_id):
        if isinstance(precio_request, list):
            return [self.update_precio(user, item, plato_id) for item in precio_request]
        plato = get_plato(user, plato_id)

        serializer = PlatoCantidadPrecioUpdateSerializer(data=precio_request)
        if not serializer.is_valid():
            raise DomainExceptions.bad_request(serializer.errors)
        serializer_data = serializer.validated_data
        try:
            cantidad_precio = plato.platocantidadprecio_set.get(cantidad=serializer_data['cantidad'])
        except PlatoCantidadPrecio.DoesNotExist:
            return self.create_precio(user, precio_request, plato_id)
        if "precio" in serializer_data:
            cantidad_precio.precio = serializer_data['precio']
        if "is_active" in serializer_data:
            cantidad_precio.is_active = serializer_data['is_active']
        cantidad_precio.save()
        self.valor_unitario_exists_and_active(plato)

        plato.refresh_from_db(fields=['platocantidadprecio_set'])
        return plato_response_dto(plato)

    def valor_unitario_exists_and_active(self, plato):
        try:
            valor_unitario = PlatoCantidadPrecio.objects.get(
                plato=plato, cantidad=1)
            if not valor_unitario.is_active:
                raise DomainExceptions.forbidden("El valor unitario debe estar siempre activo")
            return True
        except PlatoCantidadPrecio.DoesNotExist:
            raise DomainExceptions.forbidden("Debe existir un valor unitario para este plato")


class VentaService():
    def __init__(self):
        pass

    @transaction.atomic
    def create_venta(self, request):
        venta = VentaCreateSerializer(data=request.data)
        if not venta.is_valid():
            raise DomainExceptions.bad_request(venta.errors)
        is_pagada = venta.validated_data.get('pagada', False)
        detalle_list = venta.validated_data["detalle"]        
        # Crear la boleta
        boleta_general = BoletaGeneral(user=request.user, pagada=is_pagada)
        boleta_general.save()
        # Crear los registros de venta
        boleta_general = self.create_or_update_boleta_detalle(boleta_general, detalle_list)        
        # Actualizar la boleta
        boleta_general = self.update_boleta(boleta_general)
        return boleta_completa_response_dto(boleta_general)
    
    def retrieve_venta(self, request, id):
        boleta = get_boleta(request, id)
        return boleta_completa_response_dto(boleta)
    
    @transaction.atomic
    def update_venta(self, request, id):
        serializer = VentaUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            raise DomainExceptions.bad_request(serializer.errors)
        
        boleta = get_boleta(request, id)
        serializer_data = serializer.validated_data
        if "pagada" in serializer_data:
            boleta.pagada = serializer_data['pagada']
        if "detalle" in serializer_data:
            detalle_venta = serializer_data["detalle"]
            boleta = self.create_or_update_boleta_detalle(boleta, detalle_venta)
        boleta = self.update_boleta(boleta)
        boleta.save()
        return boleta_completa_response_dto(boleta)
        
    
    def update_boleta(self, boleta: BoletaGeneral):
        boleta.refresh_from_db()
        total_sin_descuento = 0
        total_descuentos = 0
        total_boleta = 0
        boleta_detalle = boleta.boletadetalle_set.all()
        for detalle in boleta_detalle:
            total_sin_descuento += detalle.total_sin_descuento
            total_descuentos += detalle.descuento
            total_boleta += detalle.total_registro
        boleta.total_sin_descuento = total_sin_descuento
        boleta.total_descuentos = total_descuentos
        boleta.total_boleta = total_boleta
        boleta.save()
        return boleta
    
    def create_or_update_boleta_detalle(self, boleta: BoletaGeneral, detalle_list: list[dict]):
        old_detalle = {detalle.plato.id: detalle for detalle in boleta.boletadetalle_set.all()}
        old_detalle_mutable = old_detalle.copy()
        new_detalle = {detalle['plato_id']: detalle for detalle in detalle_list}
        new_detalle_mutable = new_detalle.copy()
        platos_in_new_detalle = self.get_platos_vendidos(detalle_list)
        for id, detalle in old_detalle.items():
            if new_detalle.get(id, False): # Detalle sigue en la boleta
                self.update_detalle(boleta, new_detalle[id])
                del new_detalle_mutable[id]
                del old_detalle_mutable[id]            
        for id, detalle in new_detalle_mutable.items():
            plato = platos_in_new_detalle.get(id)     
            self.create_detalle(plato, detalle['cantidad'], boleta)
        for id, detalle in old_detalle_mutable.items():
            detalle.delete()    
        return boleta
    
    def update_detalle(self, boleta: BoletaGeneral, updated_detalle: dict):
        detalle = boleta.boletadetalle_set.get(plato__id=updated_detalle.get('plato_id'))
        cantidad = updated_detalle.get('cantidad')
        total_sin_descuento = calcular_total_sin_descuento(detalle.plato, cantidad)
        descuento = calcular_descuento(detalle.plato, cantidad, total_sin_descuento)
        total_registro = total_sin_descuento - descuento
        
        detalle.cantidad = cantidad
        detalle.total_sin_descuento = total_sin_descuento
        detalle.descuento = descuento
        detalle.total_registro = total_registro
        detalle.save()
        return detalle
    
    def create_detalle(self, plato: Plato, cantidad: int, boleta: BoletaGeneral):
        total_sin_descuento = calcular_total_sin_descuento(plato, cantidad)
        descuento = calcular_descuento(plato, cantidad, total_sin_descuento)
        total_registro = total_sin_descuento - descuento
        return BoletaDetalle.objects.create(
            boleta=boleta,
            plato=plato,
            cantidad=cantidad,
            total_sin_descuento=total_sin_descuento,
            descuento=descuento,
            total_registro=total_registro,
            user=boleta.user
        )      
    
    def get_platos_vendidos(self, detalles: list[dict[str, int]])-> dict[int, Plato]:
        platos_ids = set(registro.get('plato_id') for registro in detalles)
        platos = Plato.objects.prefetch_related(
            Prefetch('platocantidadprecio_set',
                     queryset=PlatoCantidadPrecio.objects.order_by('cantidad'))
        ).filter(id__in=platos_ids)
        return {plato.id: plato for plato in platos}


def get_plato(user, id):
    try:
        plato = Plato.objects.prefetch_related(
            Prefetch('platocantidadprecio_set',
                     queryset=PlatoCantidadPrecio.objects.order_by('cantidad'))
        ).get(id=id, user=user)
    except Plato.DoesNotExist:
        raise DomainExceptions.not_found("Plato no encontrado")
    return plato

def get_boleta(request, id):
    try:
        boleta = BoletaGeneral.objects.prefetch_related("boletadetalle_set").get(id=id, user=request.user)
    except BoletaGeneral.DoesNotExist:
        raise DomainExceptions.not_found("Boleta no encontrada")
    return boleta


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
