from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate, login as auth_login
from django.template.loader import render_to_string
from rest_framework import generics
from .tokens import account_activation_token
from django.core.mail import EmailMessage
from .serializers import LoginSerializer,RegisterSerializer, GuestPageSerializer
from rest_framework.authtoken.models import Token
from user.models import Profile
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from user.models import *
from django.core import serializers
import json

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
            try:
                profile = Profile.objects.get(user_id=user_info)
                photo_url = profile.photo_url
            except:
                photo_url = None

            result_dict = {"first_name": user_info.first_name, "last_name": user_info.last_name,"photo_url":photo_url ,"user_id": user_info.id,"token": str(token)}
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
        if user.is_active == False:
            user.is_active = True
            user.save()
            profile = Profile.objects.create(user_id=user)
            profile.save()
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


class GuestPage(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = GuestPageSerializer

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)


        page_number = body.get('page_number')
        page_size = body.get('page_size')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories = Story.objects.filter()



        stories = sorted(stories, key=lambda story: story.createDateTime, reverse=True)
        stories = stories[(page_number-1)*page_size: page_number*page_size]

        if len(stories)!=0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = stories[i].user_id.username
                each["is_liked"] = False
                each["story_id"] = stories[i].id

                locations = Location.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', locations)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"] for each in serialized_obj]
                [each.pop('story_id', None) for each in serialized_obj]
                each["locations"] = serialized_obj

                tags = Tag.objects.filter(story_id=stories[i])
                serialized_obj = serializers.serialize('json', tags)
                serialized_obj = json.loads(str(serialized_obj))
                serialized_obj = [each["fields"]["tag"] for each in serialized_obj]
                each["tags"] = serialized_obj

                try:
                    profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
                    serialized_obj = serializers.serialize('json', profiles)
                    serialized_obj = json.loads(str(serialized_obj))
                    serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                    each["photo_url"] = serialized_obj
                except:
                    each["photo_url"] = None



        else:
            result = []


        return JsonResponse({'return': result}, status=200)
