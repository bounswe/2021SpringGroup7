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
    multimedias = serializers.ListField(child=serializers.CharField())
    time_start = serializers.DictField(child=serializers.CharField())
    time_end = serializers.DictField(child=serializers.CharField())
    class Meta:
        model = Story
        fields = ['title', 'text', 'multimedias', 'username', 'time_start', 'time_end', 'location', 'tags']

class PostEditSerializer(serializers.ModelSerializer):
    location = serializers.ListField(child=serializers.DictField(child=serializers.CharField()))
    tags = serializers.ListField(child=serializers.CharField())
    story_id = serializers.IntegerField()
    multimedias = serializers.ListField(child=serializers.CharField())
    time_start = serializers.DictField(child=serializers.CharField())
    time_end = serializers.DictField(child=serializers.CharField())
    class Meta:
        model = Story
        fields = ['story_id', 'title', 'text', 'multimedias', 'time_start', 'time_end', 'location', 'tags']

class PostDeleteSerializer(serializers.ModelSerializer):
    story_id = serializers.IntegerField()
    class Meta:
        model = Story
        fields = ['story_id']


class LocationSerializer(serializers.ModelSerializer):
    location = serializers.CharField()
    latitude = serializers.CharField()
    longitude = serializers.CharField()
    type = serializers.CharField()
    class Meta:
        model = Location
        fields = ['location','latitude', 'longitude', 'type']


class SetProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    birthday = serializers.DateTimeField()
    biography = serializers.CharField()
    photo_url = serializers.CharField()
    public = serializers.BooleanField()
    class Meta:
        model = User
        fields = ['user_id','first_name', 'last_name','photo_url','birthday','biography','public']


class FollowSerializer(serializers.ModelSerializer):
    action_follow = serializers.BooleanField()
    class Meta:
        model = Following
        fields = ['user_id','follow','action_follow']

class BlockSerializer(serializers.ModelSerializer):
    action_block = serializers.BooleanField()
    blocker = serializers.IntegerField()
    blocked = serializers.IntegerField()
    class Meta:
        model = Blocking
        fields = ['blocker','blocked','action_block']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['story_id','user_id']

class PinCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PinnedComment
        fields = ['comment_id','story_id']

class DeleteProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    class Meta:
        model = User
        fields = ['user_id', 'password']



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
        fields = ['username', 'story_id', 'text','parent_comment_id']


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

class CommentDeleteSerializer(serializers.ModelSerializer):
    comment_id = serializers.IntegerField()

    class Meta:
        model = Comment
        fields = ['comment_id']

class ActivityStreamSerializer(serializers.ModelSerializer):
    limit = serializers.IntegerField()
    offset = serializers.IntegerField()

    class Meta:
        model = Comment
        fields = ['limit', 'offset']

class ReportStorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100)

    class Meta:
        model = Comment
        fields = ['username', 'story_id', 'text']

class ReportCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportComment
        fields = ['comment_id', 'reporter_id', 'report']

class ReportTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTag
        fields = ['tag_id', 'reporter_id', 'report']

class ReportUserSerializer(serializers.ModelSerializer):
    reported_username = serializers.CharField(max_length=100)
    reporter_username = serializers.CharField(max_length=100)
    class Meta:
        model = ReportUser
        fields = ['reported_username', 'reporter_username', 'report']

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['login_hash']

class AdminLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['admin_username', 'admin_password']

class AdminActionSerializer(serializers.ModelSerializer):
    report_id = serializers.IntegerField()
    safe = serializers.BooleanField()
    class Meta:
        model = Admin
        fields = ['login_hash','report_id', 'safe']

class BlackListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100)
    class Meta:
        model = Admin
        fields = ['login_hash','username']


class GetNotificationsSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(max_length=100)
    limit = serializers.IntegerField()
    class Meta:
        model = Comment
        fields = ['user_name', 'limit']

class FollowRequestSerializer(serializers.ModelSerializer):
    request_id = serializers.IntegerField()
    accept = serializers.BooleanField()

    class Meta:
        model = Following
        fields = ['request_id', 'accept']
