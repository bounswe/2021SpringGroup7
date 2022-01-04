from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import *
import json
from django.http import JsonResponse
from django.core import serializers



def filter_result(request_owner_username,list_of_post):
    request_owner = User.objects.get(username = request_owner_username)
    blocked_user1_query = Blocking.objects.filter(user_id_block = request_owner)
    blocked_user1 = []
    for user in blocked_user1_query:
        blocked_user1.append(user.block.username)
    blocked_user2_query = Blocking.objects.filter(block=request_owner)
    blocked_user2 = []
    for user in blocked_user2_query:
        blocked_user2.append(user.user_id_block.username)
    result_users = [post["owner_username"] for post in list_of_post]
    private_users = [user for user in result_users if not Profile.objects.get(user_id__username=user).public]
    private_not_following_users = [user for user in private_users if len(Following.objects.filter(user_id= request_owner,follow__username = user))==0]
    blocked_user = blocked_user2 + blocked_user1
    red_users = blocked_user + private_not_following_users + [request_owner.username]
    print(red_users)
    list_of_post = [post for post in list_of_post if post["owner_username"] not in red_users ]
    return list_of_post

def filter_user(request_owner_username,list_of_user):
    request_owner = User.objects.get(username = request_owner_username)
    blocked_user1_query = Blocking.objects.filter(user_id_block = request_owner)
    blocked_user1 = []
    for user in blocked_user1_query:
        blocked_user1.append(user.block.username)
    blocked_user2_query = Blocking.objects.filter(block=request_owner)
    blocked_user2 = []
    for user in blocked_user2_query:
        blocked_user2.append(user.user_id_block.username)
    blocked_user = blocked_user2 + blocked_user1
    result = []
    for each in list_of_user:
        if each['username'] not in blocked_user+[request_owner_username]:
            result.append(each)
    return result