from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from ..models import Like,Story, Comment
from django.contrib.auth.models import User
from django.core import serializers
import json
from datetime import datetime, timezone

class PinComment(generics.CreateAPIView):
    serializer_class = PinCommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'comment_id','user_id'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_id = body.get('user_id')
        comment_id= body.get('comment_id')
        try:
            user = User.objects.get(id=user_id)
            comment = Comment.objects.get(id=comment_id)
        except:
            return JsonResponse({'return': 'The user or comment does not exist'}, status=400)

        result_dict = {
            'user_id' : user_id,
            'comment_id' : comment_id
        }

        pin_relation = Pin.objects.filter(comment_id=comment, user_id=user)
        if bool(pin_relation):
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='Unpin', actor=user, comment=comment, date=dt)
            pin_relation.delete()
            result_dict['isPinned'] = False

        else:
            pin_relation = Pin(comment_id=comment,user_id=user)
            pin_relation.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='Pin', actor=user, comment=comment, date=dt)
            result_dict['isPinned'] = True

        return JsonResponse({'response': result_dict})


class GetPostLikes(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        story_id = kwargs['story_id']
        try:
            story_info = Story.objects.get(id=story_id)
        except:
            return JsonResponse({'response': 'provide valid story_id or story does not exist'})

        likers = list(Like.objects.filter(story_id=story_id).values('user_id','user_id__username'))

        result_dict = {
            'like':likers,
            'number_of_likes':len(likers)
        }

        return JsonResponse({'return': result_dict})

class GetUserLikes(generics.CreateAPIView):
    serializer_class = HomePageSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        try:
            user = User.objects.get(username=body['username'])
        except:
            return JsonResponse({'response': 'provide valid username or user does not exist'})

        user_id = user.id
        username = body['username']
        page_number = body.get('page_number')
        page_size = body.get('page_size')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)



        likes = Like.objects.filter(user_id = user_id).values_list('story_id',flat=True)
        temp_stories = Story.objects.filter(id__in=likes)

        stories = []
        for story in temp_stories:
            stories.append(story)
        stories = sorted(stories, key=lambda temp_story: temp_story.createDateTime, reverse=True)
        stories = stories[(page_number-1)*page_size: page_number*page_size]
        if len(stories)!= 0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))
            result = [each["fields"] for each in serialized_obj]
            print(result)
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