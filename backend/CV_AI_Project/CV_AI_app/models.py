from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import BaseUserManager

# Создаем собственный UserManager
class UserManager(BaseUserManager):
    def create_user(self, username, password_hash, email=None, first_name=None, last_name=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.password_hash = make_password(password_hash)  # Хешируем пароль
        user.save(using=self._db)
        return user

# Модель User
class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=128)
    email = models.EmailField(blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()  # Подключаем наш UserManager

    def __str__(self):
        return self.username

# Модель Dialogs
class Dialog(models.Model):
    title = models.CharField(max_length=255, null=False)  # Поле title с ограничением на длину
    created_at = models.DateTimeField(auto_now_add=True)  # Автоматическое добавление текущей даты при создании

    def __str__(self):
        return self.title

# Модель Messages
class Message(models.Model):
    DIALOG_SENDERS = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]

    dialog = models.ForeignKey(Dialog, on_delete=models.CASCADE, related_name='messages')  # Связь с Dialog
    sender = models.CharField(max_length=4, choices=DIALOG_SENDERS, null=False)  # Поле sender с ограничением на выбор
    content = models.TextField(null=False)  # Поле content для текста сообщения
    timestamp = models.DateTimeField(auto_now_add=True)  # Автоматическое добавление текущей даты при создании

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}"