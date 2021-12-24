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

class ProfilePost(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfilePostSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'username', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        username = body.get('username')
        page_number = body.get('page_number')
        page_size = body.get('page_size')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        users = User.objects.filter(username=username)
        stories = Story.objects.filter(user_id__username=username)
        stories = stories[(page_number-1)*page_size: page_number*page_size]
        if len(stories)!=0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = username
                each["is_liked"] = len(Like.objects.filter(story_id=stories[i], user_id__username=request.user))>0
                each["story_id"] = stories[i].id

                locations = Location.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', locations)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                each["locations"] = serialized_obj

                tags = Tag.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', tags)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["tag"] for each in serialized_obj]
                each["tags"] = serialized_obj


                profiles = Profile.objects.filter(user_id__username=username)
                serialized_obj = serializers.serialize('json', profiles)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                each["photo_url"] = serialized_obj



        else:
            result = []


        return JsonResponse({'return': result}, status=200)
