from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse


def home(request):
    return JsonResponse({'return': 'Django has started. Go to /test/hello/{your_name}'})