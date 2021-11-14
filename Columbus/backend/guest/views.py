from django.http import HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
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


def login(request):
    if request.method == 'POST':
        user_name = request.GET.get('user_name')
        password = request.GET.get('password')
        # user = auth.authenticate(username=username, password=password)
        # user = authenticate(username=username, password=password)
        #
        # if user is not None:
        #     return JsonResponse({'return': '{} is succesfully login'.format(user.user_name)})
        #     # auth.login(request, user)
        #     # return redirect('/home')
        # else:
        #     return JsonResponse("there is a error.")
        #     # return redirect("/")
        try:
            user = User.objects.get(user_name=user_name)
            encoded_pw = user.password
            if check_password(password, encoded_pw):
                return JsonResponse({'return': '{} is succesfully login'.format(user.user_name)})
            else:
                return JsonResponse({'return': 'password is incorrect'})
        except:
            return JsonResponse({'return': '{} is not existing username'.format(user_name)})
    else:
        return JsonResponse({'return': 'Send a Post request'})
