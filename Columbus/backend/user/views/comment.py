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


class CommentCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CommentCreateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'story_id', 'text','parent_comment_id'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        username = body.get('username')
        story_id = body.get('story_id')
        text = body.get('text')
        parent_comment_id = body.get('parent_comment_id')

        if parent_comment_id:
            try:
                parent_comment = Comment.objects.get(id=parent_comment_id)
            except:
                return JsonResponse({'return': 'parent comment not found. parent_comment_id can be null'}, status=400)


        try:
            user_id = User.objects.get(username=username)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)


        try:
            story = Story.objects.get(pk=story_id)
        except:
            return JsonResponse({'return': 'story not found'}, status=400)


        try:
            comment = self.create_comment(story_id=story, text=text, user_id=user_id,parent_comment_id=parent_comment_id)
            story.numberOfComments = story.numberOfComments+1
            story.save()
            comment.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='CommentCreate', actor=user_id, story=story, date=dt)
            return JsonResponse({'return': comment.id})
        except:
            return JsonResponse({'return': 'error'}, status=400)

    def create_comment(self, story_id, text, user_id,parent_comment_id):
        return Comment(story_id=story_id, text=text, user_id=user_id,parent_comment_id=parent_comment_id)

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
        result_dict = self.get_comments(story_id)

        try:
            return JsonResponse({'return': result_dict})
        except:
            return JsonResponse({'return': 'error'}, status=400)

    def get_comments(self,story_id):
        comments = Comment.objects.filter(story_id__id=story_id)
        serialized_obj = serializers.serialize('json', comments)
        serialized_obj = json.loads(str(serialized_obj))
        serialized_obj = [dict(each["fields"], **{"id": each["pk"]}) for each in serialized_obj]

        for each in serialized_obj:
            each["username"] = User.objects.get(id=each["user_id"]).username
            each['photo_url'] = Profile.objects.get(user_id__id=each["user_id"]).photo_url
            each['child_comments'] = []

        serialized_obj=sorted(serialized_obj,key=lambda element: element['date'],reverse=True)

        for child in serialized_obj:
            if child["parent_comment_id"]:
                for parent in serialized_obj:
                    if parent['id']==child["parent_comment_id"]:
                        parent['child_comments'].append(child)

        serialized_obj = [each for each in serialized_obj if not each["parent_comment_id"]]

        pinned_comments_id = list(PinnedComment.objects.filter(story_id=story_id).values_list('comment_id',flat=True))
        pinned_comments = [comment for comment in serialized_obj if comment['id'] in pinned_comments_id]
        comments = [comment for comment in serialized_obj if comment['id'] not in pinned_comments_id]
        pinned_comments = sorted(pinned_comments,key=lambda element: element['date'])
        comments = sorted(comments, key=lambda element: element['date'])

        result_dict = {
            "pinned_comments": pinned_comments,
            "comments": comments
            }
        return result_dict

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
            story = comment.story_id
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='CommentDelete', actor=comment.user_id, comment=comment, date=dt)
            comment.delete()
            comments = self.get_comments(story.id)
            story.numberOfComments = len(comments['pinned_comments'])+len(comments['comments'])
            story.save()
        except:
            return JsonResponse({'return': 'comment not found'}, status=400)

        return JsonResponse({'return': 'successful'})

    def get_comments(self,story_id):
        comments = Comment.objects.filter(story_id__id=story_id)
        serialized_obj = serializers.serialize('json', comments)
        serialized_obj = json.loads(str(serialized_obj))
        serialized_obj = [dict(each["fields"], **{"id": each["pk"]}) for each in serialized_obj]

        for each in serialized_obj:
            each["username"] = User.objects.get(id=each["user_id"]).username
            each['photo_url'] = Profile.objects.get(user_id__id=each["user_id"]).photo_url
            each['child_comments'] = []

        serialized_obj=sorted(serialized_obj,key=lambda element: element['date'],reverse=True)

        for child in serialized_obj:
            if child["parent_comment_id"]:
                for parent in serialized_obj:
                    if parent['id']==child["parent_comment_id"]:
                        parent['child_comments'].append(child)

        serialized_obj = [each for each in serialized_obj if not each["parent_comment_id"]]

        pinned_comments_id = list(PinnedComment.objects.filter(story_id=story_id).values_list('comment_id',flat=True))
        pinned_comments = [comment for comment in serialized_obj if comment['id'] in pinned_comments_id]
        comments = [comment for comment in serialized_obj if comment['id'] not in pinned_comments_id]
        pinned_comments = sorted(pinned_comments,key=lambda element: element['date'])
        comments = sorted(comments, key=lambda element: element['date'])

        result_dict = {
            "pinned_comments": pinned_comments,
            "comments": comments
            }
        return result_dict
