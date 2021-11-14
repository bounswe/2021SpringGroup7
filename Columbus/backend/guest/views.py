from django.http import HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from user.models import User


def register(request):
    if request.method == 'POST':
        user_name = request.GET.get('user_name')
        first_name = request.GET.get('first_name')
        last_name = request.GET.get('last_name')
        user_email = request.GET.get('user_email')
        password = request.GET.get('password')
        password = make_password(password)
        user = User.objects.create(user_name=user_name,
                    first_name=first_name,
                    last_name=last_name,
                    user_email=user_email,
                    password=password)
        user.save()
        return JsonResponse({'return': '{} is succesfully created'.format(user.user_name)})
    else:
        return JsonResponse({'return':'Send a Post request'})