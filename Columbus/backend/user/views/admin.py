from ..models import *
from rest_framework import generics
from ..serializers import AdminPageSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.core import serializers
import json

class AdminLogin(generics.CreateAPIView):
    serializer_class = AdminPageSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'admin_username', 'admin_password'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        admin_username = body.get('admin_username')
        admin_password = body.get('admin_password')
        try:
            admin = Admin.objects.get(admin_username=admin_username)
        except:
            return JsonResponse({'return': 'Admin is not found'},status=403)


        if admin.admin_password==admin_password:
            return JsonResponse({'return': 'Login is succesfull' })
        else:
            return JsonResponse({'return': 'Password is not valid'},status=400)

