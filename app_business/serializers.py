from rest_framework import serializers
from .models import Plato, PlatoCantidadPrecio, RegistroVenta, Boleta

class CreatePlatoSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    precio_unitario = serializers.IntegerField()
    descripcion = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)
    
    

class PlatoCantidadPrecioResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatoCantidadPrecio
        fields = ['id', 'cantidad', 'precio', 'is_active']

        
class PlatoResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True, required=False)
    nombre = serializers.CharField(required=False)
    descripcion = serializers.CharField()
    is_active = serializers.BooleanField(required=False)
    precios = PlatoCantidadPrecioResponseSerializer(many=True, required=False)


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


class RegistroRequestSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True, required=False)
    plato_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()

class RegistroResponseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    plato = PlatoResponseSerializer()
    class Meta:
        model = RegistroVenta
        fields = ['id', 'plato', 'cantidad', 'total_sin_descuento', 'descuento', 'total_registro']
        
class BoletaResponseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    class Meta:
        model = Boleta
        fields = ['id', 'timestamp', 'total_sin_descuento', 'total_descuentos', 'total_boleta']