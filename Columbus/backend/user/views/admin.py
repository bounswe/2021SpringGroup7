from ..models import *
from rest_framework import generics
from ..serializers import AdminSerializer,AdminLoginSerializer, AdminActionSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.core import serializers
from datetime import datetime

import json

class AdminLogin(generics.CreateAPIView):
    serializer_class = AdminLoginSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'admin_username', 'admin_password'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        admin_username = body.get('admin_username')
        admin_password = body.get('admin_password')
        try:
            admin = Admin.objects.get(admin_username=admin_username)
        except:
            return JsonResponse({'return': 'Admin is not found'},status=403)


        if admin.admin_password==admin_password:
            login_hash = str(abs(hash(admin_username+admin_password+str(datetime.now()))))
            admin.login_hash=login_hash
            admin.save()
            return JsonResponse({'return': login_hash})
        else:
            return JsonResponse({'return': 'Password is not valid'},status=400)

class GetReportStory(generics.CreateAPIView):
    serializer_class = AdminSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        login_hash = body.get('login_hash')
        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)
        reported_story = Report.objects.all().values().first()
        stories = Story.objects.filter(id=reported_story['story_id_id'])
        serialized_obj = serializers.serialize('json', stories)
        serialized_obj = json.loads(str(serialized_obj))
        result = [each["fields"] for each in serialized_obj]
        result_list = []
        for i, each in enumerate(result):
            result_dict = dict()
            each["owner_username"] = stories[i].user_id.username
            each["is_liked"] = False
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

            profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
            serialized_obj = serializers.serialize('json', profiles)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
            each["photo_url"] = serialized_obj
            result_dict['reported_story'] = each
            result_dict['report'] = reported_story['report']
            result_dict['reporter_id'] = reported_story['reporter_id_id']
            result_dict['report_id'] = reported_story['id']
            result_list.append(result_dict)
        return JsonResponse({'return': result_list}, status=400)

class AdminActionReportStory(generics.CreateAPIView):
    serializer_class = AdminActionSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash','report_id','safe'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        login_hash = body.get('login_hash')
        report_id = body.get('report_id')
        safe = body.get('safe')

        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        try:
            report = Report.objects.get(id=report_id)
        except:
            return JsonResponse({'return': 'Report does not exist'}, status=400)

        if safe:
            report.delete()
            return JsonResponse({'return': 'Report is deleted without any action'})
        else:
            reported_story=report.story_id
            spam_story = SpamStory(title=reported_story.title, text=reported_story.text, multimedia=reported_story.multimedia, user_id=reported_story.user_id, time_start=reported_story.time_start,
                  time_end=reported_story.time_end, numberOfLikes=0, numberOfComments=0)
            spam_story.save()
            reported_story.delete()
            return JsonResponse({'return': 'Story is carried to the spam folder'})


