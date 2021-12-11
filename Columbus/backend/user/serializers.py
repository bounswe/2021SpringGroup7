from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from django.db import models

class LogoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class ProfilePostSerializer(serializers.ModelSerializer):
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['username', 'page_number', 'page_size']

class PostCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100)
    location = serializers.ListField(child=serializers.DictField(child=serializers.CharField()))
    tags = serializers.ListField(child=serializers.CharField())
    class Meta:
        model = Story
        fields = ['title', 'text', 'multimedia', 'username', 'time_start', 'time_end', 'location', 'tags']

class GetProfileSerializer(serializers.ModelSerializer):
    birthday = serializers.DateTimeField()
    location = serializers.IntegerField()
    followers = serializers.ListSerializer(child = serializers.IntegerField(min_value = 0, max_value = 100))
    followings = serializers.ListSerializer(child = serializers.IntegerField(min_value = 0, max_value = 100))
    biography = serializers.CharField()

    class Meta:
        model = User
        fields = ['id','username', 'first_name', 'last_name','email','birthday','location','followers','followings','biography']

class SetProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    birthday = serializers.DateTimeField()
    location = serializers.IntegerField()
    biography = serializers.CharField()

    class Meta:
        model = User
        fields = ['id','username', 'first_name', 'last_name','birthday','location','biography']
