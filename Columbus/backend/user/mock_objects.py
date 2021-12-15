from django.db import models
from django.template.loader import render_to_string
from rest_framework import serializers


class MockRequest:
    def __init__(self, method, body, uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri

    def build_absolute_uri(self):
        return self.absolute_uri

def mock_create_user(username, email, password, first_name, last_name, id):
    return MockUserInside(username=username, email=email, password=password, first_name=first_name,
                          last_name=last_name, id=id)

class MockUserInside:
    def __init__(self, username, email, password, first_name, last_name, id):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.is_active = True
        self.id = id

    def save(self):
        return True

    def set_password(self, password):
        return password

class Story:
    def __init__(self, title, text, multimedia, user_id, time_start, time_end, createDateTime, lastUpdate,
                 numberOfLikes, numberOfComments):
        self.title = title
        self.text = text
        self.multimedia = multimedia
        self.user_id = user_id
        self.time_start = time_start
        self.time_end = time_end
        self.createDateTime = createDateTime
        self.lastUpdate = lastUpdate
        self.numberOfLikes = numberOfLikes
        self.numberOfComments = numberOfComments

class MockComment(models.Model):

    def __init__(self, story_id, username, text):
        self.story_id = story_id
        self.username = username
        self.text = text
        self.id = "test"

    def save(self):
        return True

class MockSerializedComment(models.Model):
    def __init__(self, fields):
        self.fields = fields


    def save(self):
        return True


class MockCommentSerializer(serializers.ModelSerializer):
    story_id = serializers.IntegerField()

    class Meta:
        model = MockComment
        fields = ['story_id']

class MockFollow:

    def __init__(self, user_id, follow):
        self.user_id = user_id
        self.follow = follow

    def delete(self):
        return True

    def save(self):
        return True

