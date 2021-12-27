from django.contrib.auth.models import User
from ..models import Blocking
from django.http import JsonResponse
from rest_framework.authtoken.models import Token



class CheckBlock(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        header_token = request.META.get('HTTP_AUTHORIZATION', None)
        if header_token:
            token = header_token.split(' ')[1]
            try:
                token_obj = Token.objects.get(key=token)
                request.user = token_obj.user
            except Token.DoesNotExist:
                pass
        try:
            request_owner_username = request.user
            request_owner = User.objects.get(username=request_owner_username)

        except:
            return
        try:
            user_id = view_kwargs['user_id']
            user= User.objects.get(id=user_id)
            if self.is_blocked(request_owner,user):
                return JsonResponse({'response': 'Forbidden'},status=403)
        except:
            return

        try:
            body = request.data
            try:
                user_id = body['id']
                user = User.objects.get(id=user_id)
            except:
                user_id = body['user_id']
                user= User.objects.get(id=user_id)
            if self.is_blocked(request_owner,user):
                return JsonResponse({'response': 'Forbidden'},status=403)
        except:
            return
        return

    def is_blocked(self,    request_owner,  requested_data):
        relation_for = Blocking.objects.filter(user_id_block=request_owner,block=requested_data)
        relation_back = Blocking.objects.filter(user_id_block=requested_data ,block=request_owner)
        if relation_for or relation_back:
            return True
