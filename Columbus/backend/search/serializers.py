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

class GeographicalSearchSerializer(serializers.ModelSerializer):
    query_latitude = serializers.FloatField()
    query_longitude = serializers.FloatField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['query_latitude', 'query_longitude', 'page_number', 'page_size']

class DateSearchSerializer(serializers.ModelSerializer):
    search_date = serializers.DateField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['search_date', 'page_number', 'page_size']

class LocationSearchSerializer(serializers.ModelSerializer):
    search_text = serializers.CharField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['search_text', 'page_number', 'page_size']


class UserSearchSerializer(serializers.ModelSerializer):
    search_text = serializers.CharField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['search_text', 'page_number', 'page_size']


class SearchSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100)
    search_text = serializers.CharField()
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()
    query_latitude = serializers.FloatField()
    query_longitude = serializers.FloatField()
    query_distance = serializers.FloatField()
    location_text = serializers.CharField()
    max_latitude = serializers.FloatField()
    max_longitude = serializers.FloatField()
    min_latitude = serializers.FloatField()
    min_longitude = serializers.FloatField()
    search_date_type = serializers.CharField()
    search_date = serializers.IntegerField()
    search_year_start = serializers.IntegerField()
    search_month_start = serializers.IntegerField()
    search_day_start = serializers.IntegerField()
    search_hour_start = serializers.IntegerField()
    search_minute_start = serializers.IntegerField()
    search_year_end = serializers.IntegerField()
    search_month_end = serializers.IntegerField()
    search_day_end = serializers.IntegerField()
    search_hour_end = serializers.IntegerField()
    search_minute_end = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['username', 'search_text', 'page_number', 'page_size', 'query_latitude', 'query_longitude', 'query_distance', 'location_text', 'max_latitude', 'max_longitude', 'min_latitude', 'min_longitude', 'search_date_type', 'search_date', 'search_year_start', 'search_month_start', 'search_day_start', 'search_hour_start', 'search_minute_start', 'search_year_end', 'search_month_end', 'search_day_end', 'search_hour_end', 'search_minute_end']
