from django.urls import path,re_path
from django.conf.urls import url

from . import views

urlpatterns = [
path('register/', views.Register.as_view()),
path('login/', views.Login.as_view()),
path('change_password/', views.ChangePassword.as_view()),
path('activate/<int:uidb64>/<str:token>/',views.activate)
]
