# Generated by Django 5.0.4 on 2024-04-22 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_business', '0007_rename_total_sin_descuento_boletadetalle_registro_sin_descuento_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='boletageneral',
            name='comentario',
            field=models.TextField(blank=True, default=''),
        ),
    ]