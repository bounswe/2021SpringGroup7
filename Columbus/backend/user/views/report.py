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




class CommentUpdate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CommentUpdateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'comment_id', 'text'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        comment_id = body.get('comment_id')
        text = body.get('text')


        try:
            comment = Comment.objects.get(pk=comment_id)
        except:
            return JsonResponse({'return': 'comment not found'}, status=400)


        try:
            comment.text = text
            comment.date = timezone.now()
            comment.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='CommentUpdate', actor=comment.user_id, comment=comment, date=dt)
            return JsonResponse({'return': comment.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)


class GetComment(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = GetCommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'story_id'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        story_id = body.get('story_id')

        comments = Comment.objects.filter(story_id__id=story_id)
        serialized_obj = serializers.serialize('json', comments)
        serialized_obj = json.loads(str(serialized_obj))
        serialized_obj = [each["fields"] for each in serialized_obj]
        for each in serialized_obj:
            each["username"] = User.objects.get(id=each["user_id"]).username

        try:
            return JsonResponse({'return': serialized_obj})
        except:
            return JsonResponse({'return': 'error'}, status=400)



class CommentDelete(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CommentDeleteSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'comment_id'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        comment_id = body.get('comment_id')

        try:
            comment = Comment.objects.get(id=comment_id)
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='CommentDelete', actor=comment.user_id, comment=comment, date=dt)
            comment.delete()
        except:
            return JsonResponse({'return': 'comment not found'}, status=400)

        return JsonResponse({'return': 'successful'})
