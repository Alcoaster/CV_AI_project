from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import BaseUserManager

# Создаем собственный UserManager
class UserManager(BaseUserManager):
    def create_user(self, username, password_hash, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.password_hash = make_password(password_hash)  # Хешируем пароль
        user.save(using=self._db)
        return user

# Модель User
class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()  # Подключаем наш UserManager

    def __str__(self):
        return self.username