from typing import Any
from rest_framework import serializers
from .models import Plato, PlatoCantidadPrecio, BoletaDetalle, BoletaGeneral

class PlatoCreateSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    precio_unitario = serializers.IntegerField()
    descripcion = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)


class PlatoCantidadPrecioResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatoCantidadPrecio
        fields = ['id', 'cantidad', 'precio', 'is_active']

        
class PlatoUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    nombre = serializers.CharField(required=False)
    descripcion = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)
    
    class Meta:
        model = Plato
        fields = ['id', 'nombre', 'descripcion', 'is_active']
    
class PlatoCantidadPrecioCreateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    is_active = serializers.BooleanField(required=False)
    class Meta:
        model = PlatoCantidadPrecio
        fields = ['id', 'cantidad', 'precio', 'is_active']
        
        
class PlatoCantidadPrecioUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    precio = serializers.IntegerField(required=False)
    is_active = serializers.BooleanField(required=False)
    class Meta:
        model = PlatoCantidadPrecio
        fields = ['id', 'cantidad', 'precio', 'is_active']

class DetallesVentaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True, required=False)
    plato_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()
    
class VentaCreateSerializer(serializers.Serializer):
    pagada = serializers.BooleanField(required=False)
    detalles = DetallesVentaSerializer(many=True)
         
        
def plato_response_dto(plato, solo_precios_activos=False) -> dict[str, Any]:
    if type(plato) is list:
        return map(lambda p: plato_response_dto(p, solo_precios_activos=solo_precios_activos), plato)
    
    plato_dict = plato.to_dict()
    if solo_precios_activos:
        plato_dict["precios"] = map(lambda precio: precio.to_dict(), plato.platocantidadprecio_set.filter(is_active=True))
    else:
        plato_dict["precios"] = map(lambda precio: precio.to_dict(), plato.platocantidadprecio_set.all())
    return plato_dict

def boleta_detalle_response_dto(detalle_boleta):
    if type(detalle_boleta) is list:
        return map(lambda r: boleta_detalle_response_dto(r), detalle_boleta)
    
    return {
        'id': detalle_boleta.id,
        'plato': plato_response_dto(detalle_boleta.plato, solo_precios_activos=True),
        'cantidad': detalle_boleta.cantidad,
        'total_sin_descuento': detalle_boleta.total_sin_descuento,
        'descuento': detalle_boleta.descuento,
        'total_registro': detalle_boleta.total_registro
    }
    
def boleta_general_response_dto(boleta):
    if type(boleta) is list:
        return map(lambda b: boleta_general_response_dto(b), boleta)
    
    return {
        'id': boleta.id,
        'timestamp': boleta.timestamp,
        'total_sin_descuento': boleta.total_sin_descuento,
        'total_descuentos': boleta.total_descuentos,
        'total_boleta': boleta.total_boleta,
        'pagada': boleta.pagada
    }
    
def boleta_completa_response_dto(boleta_general, boleta_detalle: list=None):
    boleta = boleta_general_response_dto(boleta_general)
    if boleta_detalle:
        boleta["detalle"] = boleta_detalle_response_dto(boleta_detalle)
    else:
        boleta["detalle"] = boleta_detalle_response_dto(list(boleta_general.boletadetalle_set.all()))
    return boleta