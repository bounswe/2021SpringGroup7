from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import *
from django.http import JsonResponse

# Create your views here.

class Test(generics.RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = TestSerializer
    def get(self, request, *args, **kwargs):
        user_name = kwargs['username']
        user = User.objects.get(username=user_name)
        return JsonResponse({'return': f'{user.id}'})

