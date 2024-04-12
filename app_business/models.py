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

class PlatoCantidadPrecio(models.Model):
    plato = models.ForeignKey(Plato, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio = models.IntegerField()
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.id} - {self.plato} - {self.cantidad} x ${self.precio}"
    
    class Meta:
        unique_together = [['plato', 'cantidad']]

class Boleta(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    total_sin_descuento = models.IntegerField(null=True)
    total_descuentos = models.IntegerField(null=True)
    total_boleta = models.IntegerField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class RegistroVenta(models.Model):
    cantidad = models.IntegerField()
    total_sin_descuento = models.IntegerField()
    descuento = models.IntegerField()
    total_registro = models.IntegerField()
    plato = models.ForeignKey(Plato, on_delete=models.CASCADE)
    boleta = models.ForeignKey(Boleta, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    