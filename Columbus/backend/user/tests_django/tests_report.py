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

class ReportTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="test", last_name="test")
        self.user_temp = User.objects.create(username="user_name_temp", email="user_email_temp@gmail.com", password="123456",first_name="test", last_name="test")
        self.profile = Profile.objects.create(user_id=self.user,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05')
        self.profile_temp = Profile.objects.create(user_id=self.user_temp,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05')
        self.story = Story.objects.create(title="title", text="", user_id=self.user, numberOfLikes=0, numberOfComments=0)
        self.comment = Comment(story_id=self.story, text="new text", user_id=self.user)
        self.tag = Tag.objects.create(story_id=self.story, tag="travel")
        self.user_temp.save()
        self.user.save()
        self.profile.save()
        self.profile_temp.save()
        self.story.save()
        self.comment.save()
        self.tag.save()
    def test_report_comment(self):
        request = MockRequest(method='GET',body={'comment_id':self.comment.id, 'reporter_id':self.user.id, 'report':"dummy report"})
        api = report.ReportCommentAPI()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(type(response["return"]), int)

    def test_report_tag(self):
        request = MockRequest(method='GET',body={'tag_id':self.tag.id, 'reporter_id':self.user.id, 'report':"dummy report"})
        api = report.ReportTagAPI()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(type(response["return"]), int)

    def test_report_story(self):
        request = MockRequest(method='GET',body={'username':self.user.username, 'story_id':self.story.id, 'text':"dummy report"})
        api = report.ReportStory()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(type(response["return"]), int)

    def test_report_user(self):
        request = MockRequest(method='GET',body={'reported_username':self.user.username, 'reporter_username':self.user_temp.username, 'report':"dummy report"})
        api = report.ReportUserAPI()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(type(response["return"]), int)
