from django.urls import path,re_path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('register/', views.register),
    #path('login/', views.login),
    #path('change_password/', views.change_password),
    path('activate/<slug:uidb64>/<slug:token>/',views.activate, name='activate'),
]