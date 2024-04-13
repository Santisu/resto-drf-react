from django.contrib import admin
from .models import Plato, PlatoCantidadPrecio, BoletaDetalle, BoletaGeneral

# Register your models here.
admin.site.register(Plato)
admin.site.register(PlatoCantidadPrecio)
admin.site.register(BoletaDetalle)
admin.site.register(BoletaGeneral)

