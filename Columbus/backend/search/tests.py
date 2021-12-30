from django.test import TestCase
from user.models import *
from django.contrib.auth.models import User
import ast
from .views import *

class MockRequest:
    def __init__(self, method, body, user=None,uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri
        self.user=user

    def build_absolute_uri(self):
        return self.absolute_uri

class ModelTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="I just want to go to Istanbul.", user_id=user, numberOfLikes=0, numberOfComments=0)
        story.save()
        story2 = Story.objects.create(title="istanbul", text="It is a very nice place.", user_id=user, numberOfLikes=0, numberOfComments=0)
        story2.save()
        story3 = Story.objects.create(title="ankara", text="I do not like Ankara.", user_id=user, numberOfLikes=0, numberOfComments=0)
        story3.save()
        story4 = Story.objects.create(title="turkey", text="Turkey is so nice.", user_id=user, numberOfLikes=0, numberOfComments=0)
        story4.save()
        story5 = Story.objects.create(title="bogazici", text="I study at Bogazici University", user_id=user, numberOfLikes=0, numberOfComments=0)
        story5.save()

    def test_search_title_title(self):
        request = MockRequest(method='POST',body={"search_text": "title", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_title_abcde(self):
        request = MockRequest(method='POST',body={"search_text": "abcde", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_title_istanbul(self):
        request = MockRequest(method='POST',body={"search_text": "istanbul", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 2)

    def test_search_title_ankara(self):
        request = MockRequest(method='POST',body={"search_text": "ankara", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_title_i(self):
        request = MockRequest(method='POST',body={"search_text": "I", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 3)

    def test_search_title_is(self):
        request = MockRequest(method='POST',body={"search_text": "is", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 2)

    def test_search_title_place(self):
        request = MockRequest(method='POST',body={"search_text": "place", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_title_bogazici(self):
        request = MockRequest(method='POST',body={"search_text": "boğaziçi", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_title_minus_page_size(self):
        request = MockRequest(method='POST',body={"search_text": "boğaziçi", "page_number": 1, "page_size": -1})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_title_zero_page_number(self):
        request = MockRequest(method='POST',body={"search_text": "boğaziçi", "page_number": 0, "page_size": 1})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_title_negative_page_number(self):
        request = MockRequest(method='POST',body={"search_text": "boğaziçi", "page_number": -1, "page_size": 1})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_title_second_page(self):
        request = MockRequest(method='POST',body={"search_text": "boğaziçi", "page_number": 2, "page_size": 1})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)
