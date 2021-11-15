from django.http import HttpResponseRedirect,JsonResponse,HttpResponse
from django.shortcuts import render
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
from .tokens import account_activation_token
from django.core.mail import EmailMessage

def register(request):
    if request.method == 'POST':
        required_areas = {'user_name','user_email', 'password'}
        if len(set(request.POST.keys()).intersection(required_areas))!=3:
            return JsonResponse({'return': 'Cannot be Empty:' + str(required_areas-set(request.POST.keys()))}, status = 400)

        user_name = request.POST.get('user_name')
        first_name = request.POST.get('first_name','')
        last_name = request.POST.get('last_name','')
        user_email = request.POST.get('user_email')
        password = request.POST.get('password')

        try:
            user = User.objects.create_user(username = user_name, email = user_email, password = password, first_name = first_name, last_name = last_name)
            user.save()
            #user.is_active = False
            #confirmEmail(request,user)
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

        if user is not None:
            auth_login(request, user)
            return JsonResponse({'return': 'Login is successful'})
        else:
            return JsonResponse({'return': 'Login is invalid'}, status=400)

    else:
        return JsonResponse({'return': 'Send a Post request'}, status=400)


def change_password(request):
    if request.method == 'POST':
        
        required_areas = {'user_name', 'password'}
        if set(request.POST.keys())!=required_areas:
            return JsonResponse({'return':'Required areas are:'+str(required_areas)}, status=400)

        user_name = request.POST.get('user_name')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=user_name)
        except User.DoesNotExist:
            return JsonResponse({'return': 'User not found'}, status=400)

        user.set_password(password)
        user.save()


        return JsonResponse({'return': 'Changing password is successful'})
    else:
        return JsonResponse({'return': 'Send a Post request'}, status=400)



def confirmEmail(request,user):
    mail_subject = 'Activate your blog account.'
    print(user.id)
    message = render_to_string('acc_active_email.html', {
        'user': user,
        'domain': '127.0.0.1:8000',
        'uid': user.id,
        'token': account_activation_token.make_token(user),
    })
    email = EmailMessage(
        mail_subject, message, to=[user.email]
    )
    email.send()
    return HttpResponse('Please confirm your email address to complete the registration')

def activate(request, uidb64, token):
    try:
        user = User.objects.get(id=uidb64)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return JsonResponse({'response':'Thank you for your email confirmation. Now you can login your account.'},status=200)
    else:
        return JsonResponse({'response':'Activation link is invalid!'},status=403)

