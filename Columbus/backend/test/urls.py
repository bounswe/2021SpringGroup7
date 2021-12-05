from django.urls import path
from . import views

urlpatterns = [
    path('<str:username>', views.Test.as_view()),
]