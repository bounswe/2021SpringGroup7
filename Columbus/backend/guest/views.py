from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate, logout, login as auth_login
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from .tokens import account_activation_token
from django.core.mail import EmailMessage
import json
from .serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class Register(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'email', 'password'}
        if len(set(body.keys()).intersection(required_areas)) != 3:
            return JsonResponse({'return': 'Cannot be Empty:' + str(required_areas - set(body.data.keys()))},
                                status=400)

        user_name = body.get('username')
        first_name = body.get('first_name', '')
        last_name = body.get('last_name', '')
        user_email = body.get('email')
        password = body.get('password')

        try:
            user = User.objects.create_user(username=user_name, email=user_email, password=password,
                                            first_name=first_name, last_name=last_name)
            user.is_active = False
            user.save()
            confirmEmail(request, user)
            return JsonResponse(
                {'return': '{} is succesfully created. Please confirm your e-mail to login'.format(user.username)})
        except IntegrityError as e:
            return JsonResponse({'return': str(e)}, status=400)


class Login(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):

        body = request.data
        required_areas = {'username', 'password'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_name = body.get('username')
        password = body.get('password')

        user = authenticate(request, username=user_name, password=password)

        if user is not None:

            auth_login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            user_info = User.objects.get(username=user_name)
            result_dict = {"first_name": user_info.first_name, "last_name": user_info.last_name, "user_id": user_info.id,"token": str(token)}
            return JsonResponse({'return': result_dict})
        else:
            return JsonResponse({'return': 'Login is invalid'}, status=400)


class ChangePassword(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'password'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_name = body.get('username')
        password = body.get('password')

        try:
            user = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return JsonResponse({'return': 'User not found'}, status=400)
        user.set_password(password)
        user.save()

        return JsonResponse({'return': 'Changing password is successful'})


def confirmEmail(request, user):
    mail_subject = 'Activate your blog account.'
    print(user.id)
    if 'ec2-35' in str(request.build_absolute_uri()):
        domain = 'ec2-35-158-103-6.eu-central-1.compute.amazonaws.com'
    elif 'ec2-18' in str(request.build_absolute_uri()):
        domain = 'ec2-18-197-57-123.eu-central-1.compute.amazonaws.com'
    else:
        domain ='localhost'
    message = render_to_string('acc_active_email.html', {
        'user': user,
        'domain': domain,
        'uid': user.id,
        'token': account_activation_token.make_token(user),
    })
    email = createEmail(mail_subject=mail_subject, message=message, email=user.email)
    email.send()
    return JsonResponse({'return': 'Please confirm your email address to complete the registration'})

def createEmail(mail_subject, message, email):
    return EmailMessage(mail_subject, message, to=[email])

def activate(request, uidb64, token):
    try:
        user = User.objects.get(id=uidb64)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        if 'ec2-35' in str(request.build_absolute_uri()):
            return redirect('http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com/email-confirmation')
        elif 'ec2-18' in str(request.build_absolute_uri()):
            return redirect('http://ec2-18-197-57-123.eu-central-1.compute.amazonaws.com/email-confirmation')
        else:
            return JsonResponse({'return':'user is activated'})
    else:
        if 'ec2-35' in str(request.build_absolute_uri()):
            return redirect('http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com/email-confirmation?error=true')
        elif 'ec2-18' in str(request.build_absolute_uri()):
            return redirect('http://ec2-18-197-57-123.eu-central-1.compute.amazonaws.com/email-confirmation?error=true')
        else:
            return JsonResponse({'return':'user is not activated'})


class Test(generics.RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = TestSerializer
    def get(self, request, *args, **kwargs):
        user_name = kwargs['username']
        user = User.objects.get(username=user_name)
        return JsonResponse({'return': f'{user.id}'})
