from django.shortcuts import render
from django.http import HttpResponse
from .models import Test
# Create your views here.

def say_hello(request,name):
    Test.objects.all().delete()
    test = Test(user_name=name,message='database connection is succesful')
    test.save()
    from_db = Test.objects.filter(user_name__contains=name)
    print(from_db)
    return HttpResponse('{} is succesfully tested the DB connection'.format(from_db[0].user_name))
