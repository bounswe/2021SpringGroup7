from django.test import TestCase
from ..models import *
from django.contrib.auth.models import User
import ast
from ..views import *

class MockRequest:
    def __init__(self, method, body, user=None,uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri
        self.user=user

    def build_absolute_uri(self):
        return self.absolute_uri

class FollowTestCase(TestCase):
    def setUp(self):
        self.user1_public = User.objects.create(username="user_name1", email="user_email1@gmail.com", password="123456",first_name="test", last_name="test")
        self.profile1_public = Profile.objects.create(user_id=self.user1_public, photo_url='temp.png',biography='temp likes being cool', birthday='2021-05-05',public=True)
        self.user2_public = User.objects.create(username="user_name2", email="user_email2@gmail.com", password="123456",first_name="test", last_name="test")
        self.profile2_public = Profile.objects.create(user_id=self.user2_public, photo_url='temp.png',biography='temp likes being cool', birthday='2021-05-05', public=True)
        self.user3_private = User.objects.create(username="user_name3", email="user_email3@gmail.com", password="123456",first_name="test", last_name="test")
        self.profile3_private = Profile.objects.create(user_id=self.user3_private, photo_url='temp.png',biography='temp likes being cool', birthday='2021-05-05', public=False)
        self.user1_public.save()
        self.user2_public.save()
        self.user3_private.save()
        self.profile1_public.save()
        self.profile2_public.save()
        self.profile3_private.save()
    def test_follow_public(self):
        request = MockRequest(method='POST',body={'user_id':self.user1_public.id, 'action_follow':True, 'follow':self.user2_public.id})
        api = follow.Follow()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'The user user_name1 has followed user_name2')
    def test_unfollow(self):
        request = MockRequest(method='POST',body={'user_id':self.user1_public.id, 'action_follow':False, 'follow':self.user2_public.id})
        api = follow.Follow()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'The user user_name1 has unfollowed user_name2')

    def test_follow_private(self):
        request = MockRequest(method='POST',body={'user_id':self.user1_public.id, 'action_follow':True, 'follow':self.user3_private.id})
        api = follow.Follow()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'The user user_name1 has requested to follow user_name3')

    def test_get_follow_request(self):
        request = MockRequest(method='POST',body={'user_id':self.user1_public.id, 'action_follow':True, 'follow':self.user3_private.id})
        api = follow.Follow()
        api.post(request=request)
        request = MockRequest(method='POST',body={},user=self.user3_private)
        api = follow.GetFollowRequest()
        response = api.get(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"][0]['username'], 'user_name1')
        request = MockRequest(method='POST',body={},user=self.user1_public)
        api = follow.GetFollowRequest()
        response = api.get(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_accept_follow_request(self):
        request = MockRequest(method='POST',body={'user_id':self.user1_public.id, 'action_follow':True, 'follow':self.user3_private.id})
        api = follow.Follow()
        api.post(request=request)
        request = MockRequest(method='GET',body={},user=self.user3_private)
        api = follow.GetFollowRequest()
        response = api.get(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"][0]['username'], 'user_name1')
        request_id = response['return'][0]['request_id']
        request = MockRequest(method='POST',body={'request_id':request_id, 'accept':True},user =self.user3_private)
        api = follow.AcceptFollowRequest()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], "The user user_name1 has followed user_name3")


