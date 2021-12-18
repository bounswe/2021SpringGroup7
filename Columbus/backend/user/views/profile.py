from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from ..models import *
from django.contrib.auth.models import User
from ..models import Following,Location
import json
import ast
from datetime import datetime, timezone

class GetProfileInfo(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user_id = kwargs['user_id']
        try:
            user_info = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})

        try:
            profile_info = Profile.objects.get(user_id=user_info)
        except:
            profile_info = Profile.objects.create(user_id=user_info)

        followings = list(Following.objects.filter(user_id=user_info).values('follow','follow__username'))
        followers = list(Following.objects.filter(follow=user_info).values('user_id','user_id__username'))
        try:
            location = ast.literal_eval(profile_info.location)
        except:
            location = None

        result_dict = {
            'first_name':user_info.first_name,
            'last_name': user_info.last_name,
            'birthday': profile_info.birthday,
            'location': location,
            'photo_url':profile_info.photo_url,
            'username': user_info.username,
            'email': user_info.email,
            'followers': followers,
            'followings': followings,
            'biography': profile_info.biography,
            'user_id':user_info.id
        }
        return JsonResponse({'response':result_dict})

class SetProfileInfo(generics.CreateAPIView):
    serializer_class = SetProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        user_id = body['id']
        try:
            user_info = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})


        try:
            profile_info = Profile.objects.get(user_id=user_info)
        except:
            profile_info = Profile.objects.create(user_id=user_info)

        required_areas_location = {'location', 'latitude', 'longitude', 'type'}
        if set(body['location'].keys()) != required_areas_location:
            return JsonResponse({'return': 'location not in appropriate format'}, status=400)

        dt = datetime.now(timezone.utc).astimezone()
        ActivityStream.objects.create(type='SetProfile', actor=user_info, date=dt)
        user_info.first_name = body['first_name']
        user_info.last_name = body['last_name']
        profile_info.biography = body['biography']
        profile_info.location = body['location']
        profile_info.birthday = body['birthday']
        profile_info.photo_url = body['photo_url']
        user_info.save()
        profile_info.save()
        result_dict = {
            'first_name':user_info.first_name,
            'last_name': user_info.last_name,
            'birthday': profile_info.birthday,
            'location': profile_info.location,
            'photo_url': profile_info.photo_url,
            'username': user_info.username,
            'email': user_info.email,
            'biography': profile_info.biography,
            'user_id':user_info.id
        }
        return JsonResponse({'response':result_dict})