
from django.shortcuts import render
from ..serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.schemas.openapi import AutoSchema
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse

# Create your views here.

class Logout(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = LogoutSerializer
    def post(self, request, *args, **kwargs):

        body = self.serializer_class(request.data)
        required_areas = {'username'}
        if set(body.data.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        user_name = body.data.get('username')

        user = User.objects.get(username=user_name)

        if user is not None:

            token, created = Token.objects.get_or_create(user=user)
            user_info = User.objects.get(username=user_name)
            result_dict = {"first_name": user_info.first_name, "last_name": user_info.last_name, "user_id": user_info.id,"token": str(token)}
            token.delete()
            return JsonResponse({'return': result_dict})
        else:
            return JsonResponse({'return': 'Logout is invalid'}, status=400)
