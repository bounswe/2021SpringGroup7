from django.contrib.auth.models import User
from ..models import Blocking
from django.http import JsonResponse

class CheckBlock(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        print('started')
        try:
            request_owner_username = request.user
            request_owner = User.objects.get(username=request_owner_username)
            print(request_owner)
        except:
            return
        print(view_kwargs)
        try:
            user_id = view_kwargs['user_id']
            user= User.objects.get(id=user_id)
            print(user)
            if self.is_blocked(request_owner,user):
                return JsonResponse({'response': 'Forbidden'},status=403)
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
