from ..serializers import *
from rest_framework import generics
from django.shortcuts import render
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from datetime import datetime, timezone
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from ..models import *
from django.core import serializers
from django.utils import timezone
import json


class ReportStory(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ReportStorySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'story_id', 'text'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        username = body.get('username')
        story_id = body.get('story_id')
        text = body.get('text')


        try:
            user_id = User.objects.get(username=username)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)


        try:
            story = Story.objects.get(pk=story_id)
        except:
            return JsonResponse({'return': 'story not found'}, status=400)


        try:
            report = Report(story_id=story, report=text, reporter_id=user_id)
            report.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='ReportStoryCreate', actor=user_id, story=story, date=dt)
            return JsonResponse({'return': report.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)


class ReportUserAPI(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ReportUserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'reported_username', 'reporter_username', 'report'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        reported_id = body.get('reported_username')
        reporter_id = body.get('reporter_username')
        text = body.get('report')


        try:
            reported_id = User.objects.get(username=reported_id)
        except:
            return JsonResponse({'return': 'reported not found'}, status=400)


        try:
            reporter_id = User.objects.get(username=reporter_id)
        except:
            return JsonResponse({'return': 'reporter not found'}, status=400)



        try:
            report = ReportUser(reported_id=reported_id, reporter_id=reporter_id, report=text)
            report.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='ReportUserCreate', actor=reporter_id, target=reported_id, date=dt)
            return JsonResponse({'return': report.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)

class ReportCommentAPI(generics.CreateAPIView):
    serializer_class = ReportCommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'comment_id', 'reporter_id', 'report'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        user_id = body.get('reporter_id')
        comment_id = body.get('comment_id')
        text = body.get('report')


        try:
            user_id = User.objects.get(pk=user_id)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)


        try:
            comment = Comment.objects.get(pk=comment_id)
        except:
            return JsonResponse({'return': 'comment not found'}, status=400)

        try:
            report = ReportComment(comment_id=comment, report=text, reporter_id=user_id)
            report.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='ReportCommentCreate', actor=user_id, comment=comment, date=dt)
            return JsonResponse({'return': report.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)


class ReportTagAPI(generics.CreateAPIView):
    serializer_class = ReportTagSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'tag_id', 'reporter_id', 'report'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_id = body.get('reporter_id')
        tag_id = body.get('tag_id')
        text = body.get('report')

        try:
            user_id = User.objects.get(pk=user_id)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)


        try:
            tag = Tag.objects.get(pk=tag_id)
        except:
            return JsonResponse({'return': 'tag not found'}, status=400)


        try:
            report = ReportTag(tag_id=tag, report=text, reporter_id=user_id)
            report.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='ReportTagCreate', actor=user_id, tag=tag, date=dt)
            return JsonResponse({'return': report.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)