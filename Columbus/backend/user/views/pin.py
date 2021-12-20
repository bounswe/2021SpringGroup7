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
