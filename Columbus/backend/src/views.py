from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse


def home(request):

    return JsonResponse({'return': f'Django has started.{request.build_absolute_uri()}'})