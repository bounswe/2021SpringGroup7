from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import models

class LogoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class HomePageSerializer(serializers.ModelSerializer):
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['username', 'page_number', 'page_size']
