from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

class AuthUserManager(UserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El campo Email es obligatorio')
        email = self.normalize_email(email)
        username = email
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(unique=True, verbose_name=('Email'))
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = AuthUserManager()

    def save(self, *args, **kwargs):
        if self.email:
            self.username = self.email
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.email} - {self.first_name} {self.last_name}'
