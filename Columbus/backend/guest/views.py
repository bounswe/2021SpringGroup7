from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from rest_framework import generics, viewsets
from rest_framework.schemas.openapi import AutoSchema
from .tokens import account_activation_token
from django.core.mail import EmailMessage
import json
from .serializers import *


class Register(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        body = self.serializer_class(request.data)
        required_areas = {'username', 'email', 'password'}
        if len(set(body.data.keys()).intersection(required_areas)) != 3:
            return JsonResponse({'return': 'Cannot be Empty:' + str(required_areas - set(body.data.keys()))},
                                status=400)

        user_name = body.data.get('username')
        first_name = body.data.get('first_name', '')
        last_name = body.data.get('last_name', '')
        user_email = body.data.get('email')
        password = body.data.get('password')

        try:
            user = User.objects.create_user(username=user_name, email=user_email, password=password,
                                            first_name=first_name, last_name=last_name)
            user.save()
            user.is_active = True
            # confirmEmail(request, user)
            return JsonResponse(
                {'return': '{} is succesfully created. Please confirm your e-mail to login'.format(user.username)})
        except IntegrityError as e:
            return JsonResponse({'return': str(e)}, status=400)


class Login(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
        body = self.serializer_class(request.data)
        required_areas = {'username', 'password'}
        if set(body.data.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_name = body.data.get('username')
        password = body.data.get('password')

        user = authenticate(request, username=user_name, password=password)

        if user is not None:
            auth_login(request, user)
            return JsonResponse({'return': 'Login is successful'})
        else:
            return JsonResponse({'return': 'Login is invalid'}, status=400)


class ChangePassword(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
        body = self.serializer_class(request.data)
        required_areas = {'username', 'password'}
        if set(body.data.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_name = body.data.get('username')
        password = body.data.get('password')

        try:
            user = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return JsonResponse({'return': 'User not found'}, status=400)
        user.set_password(password)
        user.save()

        return JsonResponse({'return': 'Changing password is successful'})


class Test(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = TestSerializer
    def get(self, request, *args, **kwargs):
        user_name = kwargs['username']
        user = User.objects.get(username=user_name)
        return JsonResponse({'return': f'{user.id}'})