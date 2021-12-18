from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from django.contrib.auth.models import User
from ..models import Following

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
        except:
            return JsonResponse({'return': 'The user does not exist'}, status=400)

        if action_follow:
            instance = Following.objects.filter(user_id=user, follow=follow)
            instance.delete()
            follow_relation = self.get_following(user_id=user, follow=follow)
            follow_relation.save()
            return JsonResponse({'return': f'The user {user.username} has followed {follow.username}'})
        else:
            try:
                instance = Following.objects.filter(user_id=user,follow=follow)
                instance.delete()
                return JsonResponse({'return': f'The user {user.username} has unfollowed {follow.username}'})
            except:
                return JsonResponse({'return': f'The user {user.username} following {follow.username} relation does not exist'})

    def get_following(self, user, follow):
        return Following(user_id=user, follow=follow)