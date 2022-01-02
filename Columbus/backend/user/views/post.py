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
from datetime import datetime, timezone

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
        multimedias = body.get('multimedias', [])
        time_end = body.get('time_end', None)

        tags = body.get('tags', [])

        locations = body.get('location', [])

        if len(locations)==0:
            return JsonResponse({'return': 'location not found'}, status=400)

        for each in locations:
            required_areas_location = {'location', 'latitude', 'longitude', 'type'}
            if set(each.keys()) != required_areas_location:
                return JsonResponse({'return': 'location not in appropriate format'}, status=400)


        required_areas_date = {'type'}
        if len(set(time_start.keys()).intersection(required_areas_date))!=1:
            return JsonResponse({'return': 'start date not in appropriate format'}, status=400)

        if time_end!= None:
            required_areas_date = {'type'}
            if len(set(time_end.keys()).intersection(required_areas_date))!=1:
                return JsonResponse({'return': 'end date not in appropriate format'}, status=400)

        try:
            user_id = User.objects.get(username=username)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)


        try:
            story = self.create_story(title, text, user_id)
            story.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='CreatePost', actor=user_id, story=story, date=dt)
            for each in locations:
                location = self.get_location(story_id=story, location=each['location'], latitude=each['latitude'], longitude=each['longitude'], type=each['type'])
                location.save()
            for tag_string in tags:
                post_tag = self.get_tag(story_id=story, tag=tag_string)
                post_tag.save()
            for multimedia_string in multimedias:
                post_multimedia = self.get_multimedia(story_id=story, path=multimedia_string)
                post_multimedia.save()

            post_time_start = self.get_date(story_id=story, type=time_start["type"], start_end_type="start")
            if "date" in time_start.keys():
                post_time_start.date = time_start["date"]
            if "year" in time_start.keys():
                post_time_start.year = time_start["year"]
            if "month" in time_start.keys():
                post_time_start.month = time_start["month"]
            if "day" in time_start.keys():
                post_time_start.day = time_start["day"]
            if "hour" in time_start.keys():
                post_time_start.hour = time_start["hour"]
            if "minute" in time_start.keys():
                post_time_start.minute = time_start["minute"]
            post_time_start.save()


            if time_end!= None:
                post_time_end = self.get_date(story_id=story, type=time_end["type"], start_end_type="end")
                if "date" in time_end.keys():
                    post_time_end.date = time_end["date"]
                if "year" in time_end.keys():
                    post_time_end.year = time_end["year"]
                if "month" in time_end.keys():
                    post_time_end.month = time_end["month"]
                if "day" in time_end.keys():
                    post_time_end.day = time_end["day"]
                if "hour" in time_end.keys():
                    post_time_end.hour = time_end["hour"]
                if "minute" in time_end.keys():
                    post_time_end.minute = time_end["minute"]
                post_time_end.save()


            return JsonResponse({'return': story.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)

    def create_story(self, title, text, user_id):
        return Story(title=title, text=text, user_id=user_id, numberOfLikes=0, numberOfComments=0)

    def get_location(self, story_id, location, latitude, longitude, type):
        return Location(story_id=story_id, location=location, latitude=latitude, longitude=longitude, type=type)

    def get_tag(self, story_id, tag):
        return Tag(story_id=story_id, tag=tag)

    def get_multimedia(self, story_id, path):
        return Multimedia(story_id=story_id, path=path)

    def get_date(self, story_id, type, start_end_type):
        return Date(story_id=story_id, type=type, start_end_type=start_end_type)


class PostEdit(generics.CreateAPIView):
    queryset = Story.objects.all()
    serializer_class = PostEditSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        #print(body.keys())
        required_areas = {'story_id'}

        if len(set(body.keys()).intersection(required_areas))!=1:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        story_id = body.get('story_id')

        locations = body.get('location', [{"location": "","latitude": "","longitude": "","type": ""}])

        for each in locations:
            required_areas_location = {'location', 'latitude', 'longitude', 'type'}
            if set(each.keys()) != required_areas_location:
                return JsonResponse({'return': 'location not in appropriate format'}, status=400)


        try:
            story = Story.objects.get(id=story_id)
        except:
            return JsonResponse({'return': 'story not found'}, status=400)


        if "title" in body.keys():
            try:
                story.title = body["title"]
                story.save()
            except:
                return JsonResponse({'return': 'title not in appropriate format'}, status=400)

        if "text" in body.keys():
            try:
                story.text = body["text"]
                story.save()
            except:
                return JsonResponse({'return': 'text not in appropriate format'}, status=400)
        if "multimedias" in body.keys():
            try:
                Multimedia.objects.filter(story_id=story).delete()
            except:
                return JsonResponse({'return': 'multimedia not able to delete'}, status=400)

            for multimedia_string in body["multimedias"]:
                post_multimedia = Multimedia(story_id=story, path=multimedia_string)
                post_multimedia.save()
        if "time_start" in body.keys():
            try:
                Date.objects.filter(story_id=story, start_end_type="start").delete()
            except:
                return JsonResponse({'return': 'time_start not able to delete'}, status=400)

            post_time_start = Date(story_id=story, type=body["time_start"]["type"], start_end_type="start")
            if "date" in body["time_start"].keys():
                post_time_start.date = body["time_start"]["date"]
            if "year" in body["time_start"].keys():
                post_time_start.year = body["time_start"]["year"]
            if "month" in body["time_start"].keys():
                post_time_start.month = body["time_start"]["month"]
            if "day" in body["time_start"].keys():
                post_time_start.day = body["time_start"]["day"]
            if "hour" in body["time_start"].keys():
                post_time_start.hour = body["time_start"]["hour"]
            if "minute" in body["time_start"].keys():
                post_time_start.minute = body["time_start"]["minute"]
            post_time_start.save()

        if "time_end" in body.keys():
            try:
                Date.objects.filter(story_id=story, start_end_type="end").delete()
            except:
                return JsonResponse({'return': 'time_end not able to delete'}, status=400)

            post_time_end = Date(story_id=story, type=body["time_end"]["type"], start_end_type="end")
            if "date" in body["time_end"].keys():
                post_time_end.date = body["time_end"]["date"]
            if "year" in body["time_end"].keys():
                post_time_end.year = body["time_end"]["year"]
            if "month" in body["time_end"].keys():
                post_time_end.month = body["time_end"]["month"]
            if "day" in body["time_end"].keys():
                post_time_end.day = body["time_end"]["day"]
            if "hour" in body["time_end"].keys():
                post_time_end.hour = body["time_end"]["hour"]
            if "minute" in body["time_end"].keys():
                post_time_end.minute = body["time_end"]["minute"]
            post_time_end.save()

        if "tags" in body.keys():
            try:
                Tag.objects.filter(story_id=story).delete()
            except:
                return JsonResponse({'return': 'tag not able to delete'}, status=400)

            for tag_string in body["tags"]:
                post_tag = Tag(story_id=story, tag=tag_string)
                post_tag.save()

        if "location" in body.keys():
            try:
                Location.objects.filter(story_id=story).delete()
            except:
                return JsonResponse({'return': 'location not able to delete'}, status=400)

            for each in body["location"]:
                location = Location(story_id=story, location=each['location'], latitude=each['latitude'], longitude=each['longitude'], type=each['type'])
                location.save()

        dt = datetime.now(timezone.utc).astimezone()
        ActivityStream.objects.create(type='UpdatePost', actor=story.user_id, story=story, date=dt)
        return JsonResponse({'return': story.id})


class PostDelete(generics.CreateAPIView):
    queryset = Story.objects.all()
    serializer_class = PostDeleteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):

        body = request.data
        #print(body.keys())
        required_areas = {'story_id'}

        if len(set(body.keys()).intersection(required_areas))!=1:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        story_id = body.get('story_id')

        try:
            story = Story.objects.get(id=story_id)
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='DeletePost', actor=story.user_id, story=story, date=dt)
            story.delete()
        except:
            return JsonResponse({'return': 'story not found'}, status=400)

        return JsonResponse({'return': 'successful'})


class GetPopularTags(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = kwargs['user_id']
        try:
            user_info = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})

        tag_list = Tag.objects.filter(story_id__user_id__username=user_info.username)
        popular_tags = {}
        for tag in tag_list:
            if tag.tag in popular_tags:
                popular_tags[tag.tag] = popular_tags[tag.tag] + 1
            else:
                popular_tags[tag.tag] = 1
        result_dict = {tag: popular_tags[tag] for tag in sorted(popular_tags, key=popular_tags.get, reverse=True)}

        return JsonResponse({'return': result_dict})
