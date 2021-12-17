from django.shortcuts import render
from .serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from user.models import *
from django.core import serializers
import json
import nltk


class TitleExactSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TitleExactSearchSerializer
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'search_text', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        search_text = body.get('search_text')
        page_number = body.get('page_number')
        page_size = body.get('page_size')
        username = body.get('username', '')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')
        stories = []

        for each in stories_all:
            similarity_value = len(set(search_text.lower().split()).intersection(set(each.title.lower().split())))
            if similarity_value>0:
                stories.append((similarity_value, each))


        stories = sorted(stories, key=lambda x: x[0], reverse=True)
        stories = [each[1] for each in stories]
        stories = stories[(page_number-1)*page_size: page_number*page_size]

        if len(stories)!=0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = stories[i].user_id.username
                each["is_liked"] = len(Like.objects.filter(story_id=stories[i], user_id__username=username))>0
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

                try:
                    profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
                    serialized_obj = serializers.serialize('json', profiles)
                    serialized_obj = json.loads(str(serialized_obj))
                    serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                    each["photo_url"] = serialized_obj
                except:
                    each["photo_url"] = None



        else:
            result = []


        return JsonResponse({'return': result}, status=200)


class TitlePartialSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TitlePartialSearchSerializer
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'search_text', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        search_text = body.get('search_text')
        page_number = body.get('page_number')
        page_size = body.get('page_size')
        username = body.get('username', '')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')
        stories = []

        for each in stories_all:

            distance_value = nltk.jaccard_distance(set(nltk.ngrams(search_text.lower(), n=2)), set(nltk.ngrams(each.title.lower(), n=2)))
            similarity_value = 1-distance_value
            if distance_value<0.75:
                stories.append((similarity_value, each))


        stories = sorted(stories, key=lambda x: x[0], reverse=True)
        stories = [each[1] for each in stories]
        stories = stories[(page_number-1)*page_size: page_number*page_size]

        if len(stories)!=0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = stories[i].user_id.username
                each["is_liked"] = len(Like.objects.filter(story_id=stories[i], user_id__username=username))>0
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

                try:
                    profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
                    serialized_obj = serializers.serialize('json', profiles)
                    serialized_obj = json.loads(str(serialized_obj))
                    serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                    each["photo_url"] = serialized_obj
                except:
                    each["photo_url"] = None



        else:
            result = []


        return JsonResponse({'return': result}, status=200)

class TextExactSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = TextExactSearchSerializer
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'search_text', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        search_text = body.get('search_text')
        page_number = body.get('page_number')
        page_size = body.get('page_size')
        username = body.get('username', '')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')
        stories = []

        for each in stories_all:
            similarity_value = len(set(search_text.lower().split()).intersection(set(each.text.lower().split())))
            if similarity_value>0:
                stories.append((similarity_value, each))


        stories = sorted(stories, key=lambda x: x[0], reverse=True)
        stories = [each[1] for each in stories]
        stories = stories[(page_number-1)*page_size: page_number*page_size]

        if len(stories)!=0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = stories[i].user_id.username
                each["is_liked"] = len(Like.objects.filter(story_id=stories[i], user_id__username=username))>0
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

                try:
                    profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
                    serialized_obj = serializers.serialize('json', profiles)
                    serialized_obj = json.loads(str(serialized_obj))
                    serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                    each["photo_url"] = serialized_obj
                except:
                    each["photo_url"] = None



        else:
            result = []


        return JsonResponse({'return': result}, status=200)
