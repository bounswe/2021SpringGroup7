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
from django.contrib.auth import authenticate, login as auth_login

class GetProfileInfo(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        request_owner = User.objects.get(username=request.user)
        user_id = kwargs['user_id']
        try:
            user_info = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})

        try:
            profile_info = Profile.objects.get(user_id=user_info)
        except:
            profile_info = Profile.objects.create(user_id=user_info)


        followings_query = Following.objects.filter(user_id=user_info).values('follow','follow__username')
        followings = []
        for user in followings_query:
            print(user)
            temp = dict()
            temp['user_id']=user['follow']
            temp['username'] = user['follow__username']
            temp['photo_url'] = Profile.objects.get(user_id=user['follow']).photo_url
            followings.append(temp)


        followers_query = Following.objects.filter(follow=user_info).values('user_id','user_id__username')
        followers = []
        for user in followers_query:
            temp = dict()
            temp['user_id']=user['user_id']
            temp['username'] = user['user_id__username']
            temp['photo_url'] = Profile.objects.get(user_id=user['user_id']).photo_url
            followers.append(temp)
        if request_owner.id != user_id:
            if (not profile_info.public) and (request_owner.id not in list(Following.objects.filter(follow=user_info).values_list('user_id',flat=True))):
                result_dict = {
                    'first_name': user_info.first_name,
                    'last_name': user_info.last_name,
                    'photo_url': profile_info.photo_url,
                    'username': user_info.username,
                    'followers_count': len(followers),
                    'followings_count': len(followings),
                    'biography': profile_info.biography,
                    'public': profile_info.public
                }
                return JsonResponse({'response': result_dict})

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
            'user_id':user_info.id,
            'public':profile_info.public
        }
        return JsonResponse({'response':result_dict})

class SetProfileInfo(generics.CreateAPIView):
    serializer_class = SetProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        user_id = body['user_id']
        try:
            user_info = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})


        try:
            profile_info = Profile.objects.get(user_id=user_info)
        except:
            profile_info = Profile.objects.create(user_id=user_info)

        required_areas_location = {'location', 'latitude', 'longitude', 'type'}
        for each_location in body['location']:
            if set(each_location.keys()) != required_areas_location:
                return JsonResponse({'return': 'location not in appropriate format'}, status=400)

        dt = datetime.now(timezone.utc).astimezone()
        ActivityStream.objects.create(type='SetProfile', actor=user_info, date=dt)
        user_info.first_name = body['first_name']
        user_info.last_name = body['last_name']
        profile_info.biography = body['biography']
        profile_info.location = body['location']
        profile_info.birthday = body['birthday']
        profile_info.photo_url = body['photo_url']
        profile_info.public = body['public']
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
            'user_id':user_info.id,
            'public':profile_info.public
        }
        return JsonResponse({'response':result_dict})

class DeleteProfile(generics.CreateAPIView):
    serializer_class = DeleteProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'user_id', 'password'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        user_id = body['user_id']
        password = body['password']
        try:
            user = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'},status=400)
        if str(user.username) != str(request.user):
            return JsonResponse({'response': 'Forbidden'},status=403)
        user = authenticate(request, username=user.username, password=password)
        if user:
            user = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({'response': f'{request.user} is deleted'}, status=403)
        return JsonResponse({'response': 'Provide valid password'})