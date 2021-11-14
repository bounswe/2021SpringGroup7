from django.http import HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate, login as auth_login

def register(request):
    if request.method == 'POST':

        required_areas = {'user_name', 'first_name', 'last_name', 'user_email', 'password'}
        if set(request.POST.keys())!=required_areas:
            return JsonResponse({'return':'Required areas are:'+str(required_areas)}, status=400)

        user_name = request.POST.get('user_name')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        user_email = request.POST.get('user_email')
        password = request.POST.get('password')

        try:
            user = User.objects.create_user(username = user_name, email = user_email, password = password, first_name = first_name, last_name = last_name)
            user.save()
            return JsonResponse({'return': '{} is succesfully created'.format(user.username)})
        except IntegrityError as e:
            return JsonResponse({'return':str(e)}, status=400)

    else:
        return JsonResponse({'return':'Send a Post request'})


def login(request):
    if request.method == 'POST':
        
        required_areas = {'user_name', 'password'}
        if set(request.POST.keys())!=required_areas:
            return JsonResponse({'return':'Required areas are:'+str(required_areas)}, status=400)

        user_name = request.POST.get('user_name')
        password = request.POST.get('password')


        user = authenticate(request, username=user_name, password=password)
        print(user)

        if user is not None:
            auth_login(request, user)
            return JsonResponse({'return': 'login is successful'})
        else:
            return JsonResponse({'return': 'login is invalid'}, status=400)

    else:
        return JsonResponse({'return': 'Send a Post request'})
