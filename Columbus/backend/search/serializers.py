from rest_framework import serializers
from django.contrib.auth.models import User
from user.models import *
from django.db import models

class TitleExactSearchSerializer(serializers.ModelSerializer):
    search_text = serializers.CharField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['search_text', 'page_number', 'page_size']

class TitlePartialSearchSerializer(serializers.ModelSerializer):
    search_text = serializers.CharField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['search_text', 'page_number', 'page_size']

class TextExactSearchSerializer(serializers.ModelSerializer):
    search_text = serializers.CharField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['search_text', 'page_number', 'page_size']
