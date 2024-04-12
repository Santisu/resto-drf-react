from django.contrib import admin
from .models import Plato, PlatoCantidadPrecio, RegistroVenta, Boleta

# Register your models here.
admin.site.register(Plato)
admin.site.register(PlatoCantidadPrecio)
admin.site.register(RegistroVenta)
admin.site.register(Boleta)

