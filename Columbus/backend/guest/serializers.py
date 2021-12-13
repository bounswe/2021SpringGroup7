from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name','password']

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','password']

class GuestPageSerializer(serializers.ModelSerializer):
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['page_number', 'page_size']
