from django.shortcuts import render
from django.http import HttpResponse
from .models import db
# Create your views here.

def say_hello(request,name):
    db.users.drop()
    db.users.insert_one({'message': 'database connection is succesful','input':name})
    user = db.users.find_one({'message': 'database connection is succesful'}, {'_id': False})
    return HttpResponse(f"{user['input']} is succesfully tested database connection")
