from django.urls import path
from . import views

urlpatterns = [
    path('hello/<str:name>', views.say_hello)
]