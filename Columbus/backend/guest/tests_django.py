from django.test import TestCase
from user.models import *
from django.contrib.auth.models import User
from .views import Register
import ast

class MockRequest:
    def __init__(self, method, body, uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri

    def build_absolute_uri(self):
        return self.absolute_uri

class UserTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        Tag.objects.create(story_id=story, tag="travel")

    def test_animals_can_speak(self):

        tag = Tag.objects.get(id=1)
        self.assertEqual(tag.tag, 'travel')



class RegisterTestCase(TestCase):
    def test_register(self):
        request = MockRequest(method='POST', body={"username": "user_name","email": "user_email@gmail.com","password": "123456"})
        register = Register()
        response = register.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'user_name is succesfully created. Please confirm your e-mail to login'}
