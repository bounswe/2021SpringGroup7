import requests
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
import math
from datetime import datetime
import string

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

                multimedias = Multimedia.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', multimedias)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["path"] for each in serialized_obj]
                each["multimedias"] = serialized_obj

                start_dates = Date.objects.filter(story_id=stories[i], start_end_type="start")
                serialized_obj = serializers.serialize('json', start_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_start"] = serialized_obj

                end_dates = Date.objects.filter(story_id=stories[i], start_end_type="end")
                serialized_obj = serializers.serialize('json', end_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_end"] = serialized_obj

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

                multimedias = Multimedia.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', multimedias)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["path"] for each in serialized_obj]
                each["multimedias"] = serialized_obj

                start_dates = Date.objects.filter(story_id=stories[i], start_end_type="start")
                serialized_obj = serializers.serialize('json', start_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_start"] = serialized_obj

                end_dates = Date.objects.filter(story_id=stories[i], start_end_type="end")
                serialized_obj = serializers.serialize('json', end_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_end"] = serialized_obj

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

                multimedias = Multimedia.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', multimedias)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["path"] for each in serialized_obj]
                each["multimedias"] = serialized_obj

                start_dates = Date.objects.filter(story_id=stories[i], start_end_type="start")
                serialized_obj = serializers.serialize('json', start_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_start"] = serialized_obj

                end_dates = Date.objects.filter(story_id=stories[i], start_end_type="end")
                serialized_obj = serializers.serialize('json', end_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_end"] = serialized_obj

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


class GeographicalSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = GeographicalSearchSerializer
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'query_latitude', 'query_longitude', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        query_latitude = body.get('query_latitude')
        query_longitude = body.get('query_longitude')
        page_number = body.get('page_number')
        page_size = body.get('page_size')
        username = body.get('username', '')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')
        stories = []

        for each in stories_all:
            locations = Location.objects.filter(story_id = each)
            shortest_distance = 1000000000
            for each_location in locations:
                if query_latitude!=0 and query_longitude!=0 and each_location.latitude!=0 and each_location.longitude!=0:
                    distance = math.sqrt((query_latitude-each_location.latitude)**2+(query_longitude-each_location.longitude)**2)*111
                    if distance<100:
                        shortest_distance = distance
            if shortest_distance!=1000000000:
                stories.append((-1*shortest_distance, each))



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

                multimedias = Multimedia.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', multimedias)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["path"] for each in serialized_obj]
                each["multimedias"] = serialized_obj

                start_dates = Date.objects.filter(story_id=stories[i], start_end_type="start")
                serialized_obj = serializers.serialize('json', start_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_start"] = serialized_obj

                end_dates = Date.objects.filter(story_id=stories[i], start_end_type="end")
                serialized_obj = serializers.serialize('json', end_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_end"] = serialized_obj

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


class DateSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = DateSearchSerializer
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'search_date', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        search_date = body.get('search_date')
        page_number = body.get('page_number')
        page_size = body.get('page_size')
        username = body.get('username', '')

        try:
            search_date = datetime.strptime(search_date, "%Y-%m-%d").date()
        except:
            return JsonResponse({'return': 'date not in appropriate format'}, status=400)

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')
        stories = []

        for each in stories_all:
            if each.time_end == None:
                if search_date == each.time_start:
                    stories.append((1, each))
            else:
                if search_date >= each.time_start and search_date <= each.time_end:
                    stories.append((1, each))


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

                multimedias = Multimedia.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', multimedias)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["path"] for each in serialized_obj]
                each["multimedias"] = serialized_obj

                start_dates = Date.objects.filter(story_id=stories[i], start_end_type="start")
                serialized_obj = serializers.serialize('json', start_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_start"] = serialized_obj

                end_dates = Date.objects.filter(story_id=stories[i], start_end_type="end")
                serialized_obj = serializers.serialize('json', end_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_end"] = serialized_obj

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



class LocationSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = LocationSearchSerializer
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

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        locations_all = Location.objects.filter()
        locations = []

        for each in locations_all:

            distance_value = nltk.jaccard_distance(set(nltk.ngrams(search_text.lower(), n=2)), set(nltk.ngrams(each.location.lower(), n=2)))
            similarity_value = 1-distance_value
            if distance_value<0.75:
                locations.append((similarity_value, each))


        locations = sorted(locations, key=lambda x: x[0], reverse=True)
        locations = [each[1] for each in locations]
        locations = locations[(page_number-1)*page_size: page_number*page_size]
        if len(locations)!=0:
            serialized_obj = serializers.serialize('json', locations)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]

        else:
            result = []


        return JsonResponse({'return': result}, status=200)


class UserSearch(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
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

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        users_all = User.objects.filter()
        users = []

        for each in users_all:

            if each.username.lower().startswith(search_text.lower()):
                users.append((-1*len(each.username), each))


        users = sorted(users, key=lambda x: x[0], reverse=True)
        users = [each[1] for each in users]
        users = users[(page_number-1)*page_size: page_number*page_size]
        if len(users)!=0:
            serialized_obj = serializers.serialize('json', users)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            result_new = []
            for each in result:
                result_temp = {}
                result_temp["username"] = each["username"]
                result_temp["first_name"] = each["first_name"]
                result_temp["last_name"] = each["last_name"]
                result_temp["email"] = each["email"]
                temp_user = User.objects.get(username = result_temp["username"])
                result_temp["user_id"] = temp_user.id
                try:
                    temp_profile = Profile.objects.get(user_id__username = result_temp["username"])
                    result_temp["photo_url"] = temp_profile.photo_url
                except:
                    result_temp["photo_url"] = None
                result_new.append(result_temp)
            result = result_new


        else:
            result = []


        return JsonResponse({'return': result}, status=200)

class Search(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SearchSerializer
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'page_number', 'page_size'}
        if len(set(body.keys()).intersection(required_areas))!=2:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        search_text = body.get('search_text', '')
        page_number = body.get('page_number')
        page_size = body.get('page_size')
        username = body.get('username', '')
        query_latitude = body.get('query_latitude', 0)
        query_longitude = body.get('query_longitude', 0)
        query_distance = body.get('query_distance', -1)
        location_text = body.get('location_text', '')
        max_latitude = body.get('max_latitude', -1)
        max_longitude = body.get('max_longitude', -1)
        min_latitude = body.get('min_latitude', -1)
        min_longitude = body.get('min_longitude', -1)
        search_date_type = body.get('search_date_type', '')
        search_date = body.get('search_date', -1)
        search_year_start = body.get('search_year_start', -1)
        search_month_start = body.get('search_month_start', -1)
        search_day_start = body.get('search_day_start', -1)
        search_hour_start = body.get('search_hour_start', -1)
        search_minute_start = body.get('search_minute_start', -1)
        search_year_end = body.get('search_year_end', -1)
        search_month_end = body.get('search_month_end', -1)
        search_day_end = body.get('search_day_end', -1)
        search_hour_end = body.get('search_hour_end', -1)
        search_minute_end = body.get('search_minute_end', -1)
        tags = body.get('tags', -1)

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')

        stories_returned = set(stories_all)

        if search_text != '':
            stories = []

            for each in stories_all:

                distance_value = nltk.jaccard_distance(set(nltk.ngrams(search_text.lower().translate(str.maketrans('', '', string.punctuation)), n=2)), set(nltk.ngrams(each.title.lower().translate(str.maketrans('', '', string.punctuation)), n=2)))
                similarity_value = 1-distance_value
                if distance_value<0.75:
                    stories.append((similarity_value, each))


            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]
            stories2 = stories


            stories = []

            for each in stories_all:
                similarity_value = len(set(search_text.lower().translate(str.maketrans('', '', string.punctuation)).split()).intersection(set(each.text.lower().translate(str.maketrans('', '', string.punctuation)).split())))
                if similarity_value>0:
                    stories.append((similarity_value, each))


            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]

            stories += stories2


            stories_returned = stories_returned.intersection(set(stories))

        if query_latitude!=0 and query_longitude!=0 and query_distance!=-1:

            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each, type = "Real")
                shortest_distance = 1000000000
                for each_location in locations:
                    if query_latitude!=0 and query_longitude!=0 and each_location.latitude!=0 and each_location.longitude!=0:
                        distance = math.sqrt((query_latitude-each_location.latitude)**2+(query_longitude-each_location.longitude)**2)*111
                        if distance<=query_distance:
                            shortest_distance = distance
                if shortest_distance!=1000000000:
                    stories.append((-1*shortest_distance, each))



            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]

            stories_returned = stories_returned.intersection(set(stories))

        if location_text != '':
            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each)
                for each_location in locations:
                    distance_value = nltk.jaccard_distance(set(nltk.ngrams(location_text.lower().translate(str.maketrans('', '', string.punctuation)), n=2)), set(nltk.ngrams(each_location.location.lower().translate(str.maketrans('', '', string.punctuation)), n=2)))
                    similarity_value = 1-distance_value
                    if distance_value<0.75:
                        stories.append((similarity_value, each))


            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]

            stories_returned = stories_returned.intersection(set(stories))

        if max_latitude != -1:
            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each, type = "Real")
                for each_location in locations:
                    if each_location.latitude<=max_latitude:
                        stories.append(each)

            stories_returned = stories_returned.intersection(set(stories))

        if max_longitude != -1:
            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each, type = "Real")
                for each_location in locations:
                    if each_location.longitude<=max_longitude:
                        stories.append(each)

            stories_returned = stories_returned.intersection(set(stories))

        if min_latitude != -1:
            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each, type = "Real")
                for each_location in locations:
                    if each_location.latitude>=min_latitude:
                        stories.append(each)

            stories_returned = stories_returned.intersection(set(stories))

        if min_longitude != -1:
            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each, type = "Real")
                for each_location in locations:
                    if each_location.longitude>=min_longitude:
                        stories.append(each)

            stories_returned = stories_returned.intersection(set(stories))

        if search_date_type != '':
            stories = []
            if search_date_type == "century":
                for each in stories_all:
                    dates = Date.objects.filter(story_id = each, type = "century", start_end_type = "start")
                    for date in dates:
                        if date.date==search_date:
                            stories.append(each)

                    dates = Date.objects.filter(story_id = each, type = "decade", start_end_type = "start")
                    for date in dates:
                        if str(date.date)[:-1]==str(search_date):
                            stories.append(each)

                    dates = Date.objects.filter(story_id = each, type = "specific", start_end_type = "start")
                    end_dates = Date.objects.filter(story_id = each, type = "specific", start_end_type = "end")
                    for date in dates:
                        if date.year!=None:
                            if str(date.year)[:-2]==str(search_date):
                                stories.append(each)
                            if len(end_dates)==1:
                                if end_dates[0].year!=None:
                                    for temp_values in range(int(str(date.year)[:-2]), int(str(end_dates[0].year)[:-2])+1):
                                        if str(temp_values)==str(search_date):
                                            stories.append(each)

                stories_returned = stories_returned.intersection(set(stories))

            elif search_date_type == "decade":
                for each in stories_all:
                    dates = Date.objects.filter(story_id = each, type = "decade", start_end_type = "start")
                    for date in dates:
                        if date.date==search_date:
                            stories.append(each)

                    dates = Date.objects.filter(story_id = each, type = "specific", start_end_type = "start")
                    end_dates = Date.objects.filter(story_id = each, type = "specific", start_end_type = "end")
                    for date in dates:
                        if date.year!=None:
                            if str(date.year)[:-1]==str(search_date):
                                stories.append(each)
                            if len(end_dates)==1:
                                if end_dates[0].year!=None:
                                    for temp_values in range(int(str(date.year)[:-1]), int(str(end_dates[0].year)[:-1])+1):
                                        if str(temp_values)==str(search_date):
                                            stories.append(each)
                stories_returned = stories_returned.intersection(set(stories))

            elif search_date_type == "specific":
                query_start_date = 0
                if search_year_start!=-1:
                    query_start_date += 518400*search_year_start
                if search_month_start!=-1:
                    query_start_date += 43200*search_month_start
                if search_day_start!=-1:
                    query_start_date += 1440*search_day_start
                if search_hour_start!=-1:
                    query_start_date += 60*search_hour_start
                if search_minute_start!=-1:
                    query_start_date += 1*search_minute_start

                query_end_date = 0
                if search_year_end!=-1:
                    query_end_date += 518400*search_year_end
                if search_month_end!=-1:
                    query_end_date += 43200*search_month_end
                if search_day_end!=-1:
                    query_end_date += 1440*search_day_end
                if search_hour_end!=-1:
                    query_end_date += 60*search_hour_end
                if search_minute_end!=-1:
                    query_end_date += 1*search_minute_end

                if query_end_date==0:
                    query_end_date = query_start_date

                for each in stories_all:
                    story_start_date = Date.objects.filter(story_id = each, type = "specific", start_end_type = "start")
                    if len(story_start_date)==0:
                        continue
                    story_start_date = date_to_minute(story_start_date[0])

                    story_end_date = Date.objects.filter(story_id = each, type = "specific", start_end_type = "end")
                    if len(story_end_date)==0:
                        story_end_date = story_start_date
                    else:
                        story_end_date = date_to_minute(story_end_date[0])

                    total = sorted([(query_start_date, "query_start_date"),(query_end_date, "query_end_date"),(story_start_date, "story_start_date"),(story_end_date, "story_end_date")])

                    if (total[0][1][0]!=total[1][1][0]) or (total[0][1][0]==total[1][1][0] and total[1][0]==total[2][0]):
                        stories.append(each)
                stories_returned = stories_returned.intersection(set(stories))


        stories_returned = list(set(stories_returned))
        if tags != -1:
            story_with_tags = []
            for each in tags:
                try:
                    tags_normal = Tag.objects.filter(tag=each)
                    for temp in tags_normal:
                        try:
                            story_with_tags.append(temp.story_id.id)
                        except:
                            continue
                except:
                    continue
                wiki_params = {
                    'action': 'wbsearchentities',
                    'format': 'json',
                    'language': 'en',
                    'search': each
                }
                r = requests.get("https://www.wikidata.org/w/api.php", params=wiki_params)
                wikidata = []
                index = 0
                for each in r.json()['search']:
                    if index < 10:
                        wikidata.append(each['label'])
                    index = index + 1
                for each_wd in list(set(wikidata)):
                    try:
                        tag_wd = Tag.objects.filter(tag=each_wd)
                        for temp in tag_wd:
                            try:
                                story_with_tags.append(temp.story_id.id)
                            except:
                                continue
                    except:
                        continue
            temp_stories = []
            for each in stories_returned:
                if each.id in story_with_tags:
                    temp_stories.append(each)
            stories_returned = temp_stories
        stories_returned = stories_returned[(page_number-1)*page_size: page_number*page_size]
        if len(stories_returned)!=0:
            serialized_obj = serializers.serialize('json', stories_returned)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = stories_returned[i].user_id.username
                each["is_liked"] = len(Like.objects.filter(story_id=stories_returned[i], user_id__username=username))>0
                each["story_id"] = stories_returned[i].id

                locations = Location.objects.filter(story_id=stories_returned[i])
                serialized_obj = serializers.serialize('json', locations)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                each["locations"] = serialized_obj

                tags = Tag.objects.filter(story_id=stories_returned[i])
                serialized_obj = serializers.serialize('json', tags)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["tag"] for each in serialized_obj]
                each["tags"] = serialized_obj

                multimedias = Multimedia.objects.filter(story_id=stories_returned[i])
                serialized_obj = serializers.serialize('json', multimedias)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["path"] for each in serialized_obj]
                each["multimedias"] = serialized_obj

                start_dates = Date.objects.filter(story_id=stories_returned[i], start_end_type="start")
                serialized_obj = serializers.serialize('json', start_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_start"] = serialized_obj

                end_dates = Date.objects.filter(story_id=stories_returned[i], start_end_type="end")
                serialized_obj = serializers.serialize('json', end_dates)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                [each.pop('start_end_type', None) for each in serialized_obj]
                each["time_end"] = serialized_obj

                try:
                    profiles = Profile.objects.filter(user_id__username=stories_returned[i].user_id.username)
                    serialized_obj = serializers.serialize('json', profiles)
                    serialized_obj = json.loads(str(serialized_obj))
                    serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                    each["photo_url"] = serialized_obj
                except:
                    each["photo_url"] = None



        else:
            result = []


        return JsonResponse({'return': result}, status=200)

def date_to_minute(date):
    temp_minute = 0
    if date.year!=None:
        temp_minute += 518400*date.year
    if date.month!=None:
        temp_minute += 43200*date.month
    if date.day!=None:
        temp_minute += 1440*date.day
    if date.hour!=None:
        temp_minute += 60*date.hour
    if date.minute!=None:
        temp_minute += 1*date.minute
    return temp_minute
