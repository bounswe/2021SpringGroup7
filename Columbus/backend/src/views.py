from django.shortcuts import redirect
from django.http import HttpResponse


def home(request):
    return HttpResponse('Django has started. Go to /test/hello/{your_name}')