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

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories_all = Story.objects.filter().order_by('-createDateTime')

        stories_returned = []

        if search_text != '':
            stories = []

            for each in stories_all:

                distance_value = nltk.jaccard_distance(set(nltk.ngrams(search_text.lower(), n=2)), set(nltk.ngrams(each.title.lower(), n=2)))
                similarity_value = 1-distance_value
                if distance_value<0.75:
                    stories.append((similarity_value, each))


            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]


            stories_returned += stories

            stories = []

            for each in stories_all:
                similarity_value = len(set(search_text.lower().split()).intersection(set(each.text.lower().split())))
                if similarity_value>0:
                    stories.append((similarity_value, each))


            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]


            stories_returned += stories

        if query_latitude!=0 and query_longitude!=0 and query_distance!=-1:

            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each, type = "Real")
                shortest_distance = 1000000000
                for each_location in locations:
                    if query_latitude!=0 and query_longitude!=0 and each_location.latitude!=0 and each_location.longitude!=0:
                        distance = math.sqrt((query_latitude-each_location.latitude)**2+(query_longitude-each_location.longitude)**2)*111
                        if distance<query_distance:
                            shortest_distance = distance
                if shortest_distance!=1000000000:
                    stories.append((-1*shortest_distance, each))



            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]

            stories_returned += stories

        if location_text != '':
            stories = []

            for each in stories_all:
                locations = Location.objects.filter(story_id = each)
                for each_location in locations:
                    distance_value = nltk.jaccard_distance(set(nltk.ngrams(location_text.lower(), n=2)), set(nltk.ngrams(each_location.location.lower(), n=2)))
                    similarity_value = 1-distance_value
                    if distance_value<0.75:
                        stories.append((similarity_value, each))


            stories = sorted(stories, key=lambda x: x[0], reverse=True)
            stories = [each[1] for each in stories]


            stories_returned += stories
            


        stories_returned = list(set(stories_returned))
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
