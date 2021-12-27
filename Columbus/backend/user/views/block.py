from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from django.contrib.auth.models import User
from ..models import Blocking
from datetime import datetime, timezone

class Block(generics.CreateAPIView):
    serializer_class = BlockSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'user_id_block', 'block','action_block'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_id_block = body.get('user_id_block')
        block = body.get('block')
        action_block = body.get('action_block')
        try:
            user = User.objects.get(id=user_id_block)
            block = User.objects.get(id=block)
        except:
            return JsonResponse({'return': 'The user does not exist'}, status=400)

        if action_block:
            instance = Blocking.objects.filter(user_id_block=user, block=block)
            instance.delete()
            block_relation = self.get_blocking(user_id_block=user, block=block)
            block_relation.save()
            dt = datetime.now(timezone.utc).astimezone()
            ActivityStream.objects.create(type='Block', actor=user, target=block, date=dt)
            return JsonResponse({'return': f'The user {user.username} has blocked {block.username}'})
        else:
            try:
                instance = Blocking.objects.filter(user_id_block=user,block=block)
                instance.delete()
                dt = datetime.now(timezone.utc).astimezone()
                ActivityStream.objects.create(type='Unblock', actor=user, target=block, date=dt)
                return JsonResponse({'return': f'The user {user.username} has unblocked {block.username}'})
            except:
                return JsonResponse({'return': f'The user {user.username} blocking {block.username} relation does not exist'})

    def get_blocking(self, user_id_block, block):
        return Blocking(user_id_block=user_id_block, block=block)
