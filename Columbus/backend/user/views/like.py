from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from ..models import Like,Story
from django.contrib.auth.models import User

class LikePost(generics.CreateAPIView):
    serializer_class = LikeSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'story_id','user_id', 'action_like'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_id = body.get('user_id')
        story_id= body.get('story_id')
        action_like = body.get('action_like')
        try:
            user = User.objects.get(id=user_id)
            story = Story.objects.get(id=story_id)
        except:
            return JsonResponse({'return': 'The user or story does not exist'}, status=400)

        if action_like:
            like_relation = Like(story_id=story,user_id=user)
            like_relation.save()
            return JsonResponse({'return': f'The user {user.username} has like {story.title}'})
        else:
            try:
                instance = Like.objects.filter(story_id=story,user_id=user)
                instance.delete()
                return JsonResponse({'return': f'The user {user.username} has unliked {story.title}'})
            except:
                return JsonResponse({'return': f'The user {user.username} liking {story.title} relation does not exist'})