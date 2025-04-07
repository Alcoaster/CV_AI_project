from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password_hash']
        extra_kwargs = {'password_hash': {'write_only': True}}

    def create(self, validated_data):
        # Используем метод create_user из нашего UserManager
        return User.objects.create_user(
            username=validated_data['username'],
            password_hash=validated_data['password_hash']
        )