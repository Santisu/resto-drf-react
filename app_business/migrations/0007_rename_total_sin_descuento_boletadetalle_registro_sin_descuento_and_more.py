# Generated by Django 5.0.4 on 2024-04-22 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_business', '0006_boletageneral_pagada'),
    ]

    operations = [
        migrations.RenameField(
            model_name='boletadetalle',
            old_name='total_sin_descuento',
            new_name='registro_sin_descuento',
        ),
        migrations.RenameField(
            model_name='boletadetalle',
            old_name='total_registro',
            new_name='registro_total',
        ),
        migrations.RemoveField(
            model_name='boletageneral',
            name='pagada',
        ),
        migrations.AddField(
            model_name='boletageneral',
            name='is_delivered',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='boletageneral',
            name='is_paid',
            field=models.BooleanField(default=False),
        ),
    ]