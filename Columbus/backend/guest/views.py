from django.http import HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from user.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email


def register(request):
    if request.method == 'POST':
        user_name = request.GET.get('user_name')

        if not user_name:
            return JsonResponse({'response': 'provide a user name', 'status': 400})

        if User.objects.filter(user_name=user_name).exists():
            return JsonResponse({'response': 'user name is already taken', 'status': 403})

        first_name = request.GET.get('first_name')
        last_name = request.GET.get('last_name')

        user_email = request.GET.get('user_email')
        try:
            validate_email(user_email)
        except:
            return JsonResponse({'response': 'provide a valid e-mail', 'status': 400})

        if User.objects.filter(user_email=user_email).exists():
            return JsonResponse({'response': 'e-mail is already taken', 'status': 403})

        password = request.GET.get('password')
        if not password:
            return JsonResponse({'response': 'provide a password', 'status': 400})
        if len(password)<8:
            return JsonResponse({'response': 'provide a strong password having length of greater than 8', 'status': 403})
        password = make_password(password)
        user = User(user_name=user_name,
                    first_name=first_name,
                    last_name=last_name,
                    user_email=user_email,
                    password=password)
        user.save()
        return JsonResponse({'response': '{} is succesfully created'.format(user.user_name),'status':200})
    else:
        return JsonResponse({'response':'Send a Post request','status':400})