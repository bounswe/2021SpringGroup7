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

class PostEditSerializer(serializers.ModelSerializer):
    location = serializers.ListField(child=serializers.DictField(child=serializers.CharField()))
    tags = serializers.ListField(child=serializers.CharField())
    story_id = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['story_id', 'title', 'text', 'multimedia', 'time_start', 'time_end', 'location', 'tags']


class LocationSerializer(serializers.ModelSerializer):
    location = serializers.CharField()
    latitude = serializers.CharField()
    longitude = serializers.CharField()
    type = serializers.CharField()
    class Meta:
        model = Location
        fields = ['location','latitude', 'longitude', 'type']


class SetProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    birthday = serializers.DateTimeField()
    location = LocationSerializer(many=False)
    biography = serializers.CharField()
    photo_url = serializers.CharField()
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name','photo_url','birthday','location','biography']


class FollowSerializer(serializers.ModelSerializer):
    action_follow = serializers.BooleanField()
    class Meta:
        model = Following
        fields = ['user_id','follow','action_follow']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['story_id','user_id']

class HomePageSerializer(serializers.ModelSerializer):
    page_number = serializers.IntegerField()
    page_size = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['username', 'page_number', 'page_size']

class CommentCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100)

    class Meta:
        model = Comment
        fields = ['username', 'story_id', 'text']


class CommentUpdateSerializer(serializers.ModelSerializer):
    comment_id = serializers.IntegerField()

    class Meta:
        model = Comment
        fields = ['comment_id', 'text']


class GetCommentSerializer(serializers.ModelSerializer):
    story_id = serializers.IntegerField()

    class Meta:
        model = Comment
        fields = ['story_id']
