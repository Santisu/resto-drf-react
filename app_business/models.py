from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Plato(models.Model):
    nombre = models.CharField(max_length=45)
    descripcion = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.id} - {self.nombre}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'is_active': self.is_active
        }

class PlatoCantidadPrecio(models.Model):
    plato = models.ForeignKey(Plato, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio = models.IntegerField()
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.id} - {self.plato} - {self.cantidad} x ${self.precio}"
    
    def to_dict(self):
        return {
            'cantidad': self.cantidad,
            'precio': self.precio,
            'is_active': self.is_active
        }
    
    class Meta:
        unique_together = [['plato', 'cantidad']]

class BoletaGeneral(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    total_sin_descuento = models.IntegerField(null=True)
    total_descuentos = models.IntegerField(null=True)
    total_boleta = models.IntegerField(null=True)
    is_paid = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class BoletaDetalle(models.Model):
    cantidad = models.IntegerField()
    registro_sin_descuento = models.IntegerField()
    descuento = models.IntegerField()
    registro_total = models.IntegerField()
    plato = models.ForeignKey(Plato, on_delete=models.CASCADE)
    boleta = models.ForeignKey(BoletaGeneral, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    