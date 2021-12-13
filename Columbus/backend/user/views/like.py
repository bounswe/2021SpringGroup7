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
        required_areas = {'story_id','user_id'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_id = body.get('user_id')
        story_id= body.get('story_id')
        try:
            user = User.objects.get(id=user_id)
            story = Story.objects.get(id=story_id)
        except:
            return JsonResponse({'return': 'The user or story does not exist'}, status=400)

        result_dict = {
            'user_id' : user_id,
            'story_id' : story_id
        }

        like_relation = Like.objects.filter(story_id=story, user_id=user)
        if bool(like_relation):
            story.numberOfLikes = story.numberOfLikes - 1
            story.save()
            like_relation.delete()
            result_dict['isLiked'] = False

        else:
            like_relation = Like(story_id=story,user_id=user)
            like_relation.save()
            story.numberOfLikes = story.numberOfLikes + 1
            story.save()
            result_dict['isLiked'] = True

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
