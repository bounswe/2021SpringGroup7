from django.urls import path
from . import views

urlpatterns = [
path('logout/', views.logout.Logout.as_view()),
]
