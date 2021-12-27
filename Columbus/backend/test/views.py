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
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = TestSerializer
    def get(self, request, *args, **kwargs):
        print('x')
        path_in_local = './deneme.png'
        path_in_s3 = 'deneme/hamza/1/deneme.png'
        #upload_to_s3(path_in_local,path_in_s3)
        path_in_local = './deneme_from_s3.png'
        return JsonResponse({'return': 'ASD'})

