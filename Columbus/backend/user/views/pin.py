from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from ..models import Story, PinnedComment
from datetime import datetime, timezone

class PinComment(generics.CreateAPIView):
    serializer_class = PinCommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'comment_id','story_id'}
        user = request.user
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        story_id = body.get('story_id')
        comment_id= body.get('comment_id')
        try:
            story = Story.objects.get(id=story_id)
            comment = Comment.objects.get(id=comment_id)
            user = User.objects.get(username=user)
        except:
            return JsonResponse({'return': 'The story or comment does not exist'}, status=400)

        if story.user_id.username != user.username:
            return JsonResponse({'return': 'The user is not allowed for the action'}, status=400)

        if bool(comment.parent_comment_id):
            return JsonResponse({'return': 'This is a reply. Only comments can be pinned'}, status=400)

        result_dict = {
            'story_id' : story_id,
            'comment_id' : comment_id
        }

        pin_relation = PinnedComment.objects.filter(comment_id=comment, story_id=story)
        if bool(pin_relation):
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='Unpin', actor=user, comment=comment, date=dt)
            pin_relation.delete()
            result_dict['isPinned'] = False

        else:
            pin_relation = PinnedComment(comment_id=comment, story_id=story)
            pin_relation.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='Pin', actor=user, comment=comment, date=dt)
            result_dict['isPinned'] = True

        return JsonResponse({'response': result_dict})
