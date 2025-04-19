from rest_framework import serializers
from .models import User, Dialog, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password_hash', 'first_name', 'last_name']
        extra_kwargs = {
            'password_hash': {'write_only': True},
            'email': {'required': True}  # Указываем, что email является обязательным
        }

    def create(self, validated_data):
        # Используем метод create_user из нашего UserManager
        return User.objects.create_user(
            email=validated_data['email'],
            password_hash=validated_data['password_hash']
        )

class DialogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dialog
        fields = ['id', 'title', 'user']  # Добавили поле user для сериализации


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'dialog', 'sender', 'content', 'timestamp']