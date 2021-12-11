from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from ..models import *
from django.contrib.auth.models import User
from ..models import Following

class GetProfileInfo(generics.ListAPIView):
    serializer_class = GetProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user_id = kwargs['user_id']
        try:
            user_info = User.objects.get(id=user_id)
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})

        profile_info = Profile.objects.get(user_id=user_info)
        followings = list(Following.objects.filter(user_id=user_info).values_list('follow',flat=True))
        followers = list(Following.objects.filter(follow=user_info).values_list('user_id',flat=True))
        result_dict = {
            'first_name':user_info.first_name,
            'last_name': user_info.last_name,
            'birthday': profile_info.birthday,
            'location': profile_info.location,
            'username': user_info.username,
            'email': user_info.email,
            'followers': followers,
            'followings': followings,
            'biography': profile_info.biography,
            'user_id':user_info.id
        }
        print(list(followers))
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

        profile_info = Profile.objects.get(user_id=user_info)
        user_info.username = body['username']
        user_info.first_name = body['first_name']
        user_info.last_name = body['last_name']
        profile_info.biography = body['biography']
        profile_info.location = body['location']
        profile_info.birthday = body['birthday']
        user_info.save()
        profile_info.save()
        result_dict = {
            'first_name':user_info.first_name,
            'last_name': user_info.last_name,
            'birthday': profile_info.birthday,
            'location': profile_info.location,
            'username': user_info.username,
            'email': user_info.email,
            'biography': profile_info.biography,
            'user_id':user_info.id
        }
        return JsonResponse({'response':result_dict})