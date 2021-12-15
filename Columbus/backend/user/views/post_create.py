from django.shortcuts import render
from ..serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from ..models import *
from django.core import serializers
import json


# Create your views here.

class PostCreate(generics.CreateAPIView):
    queryset = Story.objects.all()
    serializer_class = PostCreateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        #print(body.keys())
        required_areas = {'title', 'username', 'time_start'}

        if len(set(body.keys()).intersection(required_areas))!=3:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        title = body.get('title')
        username = body.get('username')
        time_start = body.get('time_start')

        text = body.get('text', '')
        multimedia = body.get('multimedia', '')
        time_end = body.get('time_end', None)

        tags = body.get('tags', [])

        locations = body.get('location', [])

        if len(locations)==0:
            return JsonResponse({'return': 'location not found'}, status=400)

        for each in locations:
            required_areas_location = {'location', 'latitude', 'longitude', 'type'}
            if set(each.keys()) != required_areas_location:
                return JsonResponse({'return': 'location not in appropriate format'}, status=400)


        try:
            user_id = User.objects.get(username=username)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)


        try:
            story = self.create_story(self, title, text, multimedia, user_id, time_start, time_end)
            story.save()
            for each in locations:
                location = self.get_location(story_id=story, location=each['location'], latitude=each['latitude'], longitude=each['longitude'], type=each['type'])
                location.save()
            for tag_string in tags:
                post_tag = self.get_tag(story_id=story, tag=tag_string)
                post_tag.save()
            return JsonResponse({'return': story.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)

    def create_story(self, title, text, multimedia, user_id, time_start, time_end):
        return Story(title=title, text=text, multimedia=multimedia, user_id=user_id, time_start=time_start, time_end=time_end, numberOfLikes=0, numberOfComments=0)

    def get_location(self, story_id, location, latitude, longitude, type):
        return Location(story_id=story_id, location=location, latitude=latitude, longitude=longitude, type=type)

    def get_tag(self, story_id, tag):
        return Tag(story_id=story_id, tag=tag)