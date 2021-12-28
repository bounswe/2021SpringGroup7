from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from django.contrib.auth.models import User
from ..models import Following
from datetime import datetime, timezone

class Follow(generics.CreateAPIView):
    serializer_class = FollowSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'user_id', 'follow','action_follow'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_id = body.get('user_id')
        follow = body.get('follow')
        action_follow = body.get('action_follow')
        try:
            user = User.objects.get(id=user_id)
            follow = User.objects.get(id=follow)
            profile = Profile.objects.get(user_id=follow)
        except:
            return JsonResponse({'return': 'The user does not exist'}, status=400)

        if action_follow:
            if profile.public:
                instance = Following.objects.filter(user_id=user, follow=follow)
                instance.delete()
                follow_relation = self.get_following(user_id=user, follow=follow)
                follow_relation.save()
                dt = datetime.now(timezone.utc).astimezone()
                ActivityStream.objects.create(type='Follow', actor=user, target=follow, date=dt)
                return JsonResponse({'return': f'The user {user.username} has followed {follow.username}'})
            else:
                instance = FollowRequest.objects.filter(user_id=user, follow=follow)
                instance.delete()
                follow_relation = FollowRequest(user_id=user, follow=follow)
                follow_relation.save()
                dt = datetime.now(timezone.utc).astimezone()
                ActivityStream.objects.create(type='FollowRequest', actor=user, target=follow, date=dt)
                return JsonResponse({'return': f'The user {user.username} has requested to follow {follow.username}'})
        else:
            try:
                instance = Following.objects.filter(user_id=user,follow=follow)
                instance.delete()
                dt = datetime.now(timezone.utc).astimezone()
                ActivityStream.objects.create(type='Unfollow', actor=user, target=follow, date=dt)
                return JsonResponse({'return': f'The user {user.username} has unfollowed {follow.username}'})
            except:
                return JsonResponse({'return': f'The user {user.username} following {follow.username} relation does not exist'})

    def get_following(self, user_id, follow):
        return Following(user_id=user_id, follow=follow)


class GetFollowRequest(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        request_owner = request.user
        try:
            user = User.objects.get(username=request_owner)
        except:
            return JsonResponse({'response': 'user does not exist'})

        follow_requests = FollowRequest.objects.filter(follow=user)
        result_list = []
        for each in follow_requests:
            result_dict = {
                "request_id":each.id,
                "user_id":each.user_id.id,
                "username":each.user_id.username,
                "photo_url":Profile.objects.get(user_id=each.user_id).photo_url
            }
            result_list.append(result_dict)

        return JsonResponse({'return': result_list})

class AcceptFollowRequest(generics.CreateAPIView):
    serializer_class = FollowRequestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        request_owner = request.user
        body = request.data
        required_areas = {'request_id', 'accept'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        try:
            user = User.objects.get(username=request_owner)
        except:
            return JsonResponse({'response': 'user does not exist'},status=403)

        request_id = body.get('request_id')
        accept = body.get('accept')

        try:
            follow_request = FollowRequest.objects.get(pk=request_id)
        except:
            return JsonResponse({'response': 'Request does not exist'}, status=403)

        if follow_request.follow.username == user.username:
            if accept:
                instance = Following.objects.filter(user_id=follow_request.user_id, follow=user)
                instance.delete()
                follow_relation = Following(user_id=follow_request.user_id, follow=user)
                follow_relation.save()
                follow_request.delete()
                dt = datetime.now(timezone.utc).astimezone()
                ActivityStream.objects.create(type='Follow', actor=follow_request.user_id, target=user, date=dt)
                return JsonResponse({'return': f'The user {follow_request.user_id.username} has followed {user.username}'})
            else:
                follow_request.delete()
                return JsonResponse({'return': f'The user {follow_request.user_id.username} did not follow {user.username}'})
        else:
            return JsonResponse({'response': f'{user.username} is not allowed for the action'}, status=403)

