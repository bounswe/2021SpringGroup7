from ..serializers import *
from rest_framework import generics
from django.shortcuts import render
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from ..models import *
from django.core import serializers
import json


class CommentCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CommentCreateSerializer
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
            comment = Comment(story_id=story, text=text, user_id=user_id)
            comment.save()
            return JsonResponse({'return': comment.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)
