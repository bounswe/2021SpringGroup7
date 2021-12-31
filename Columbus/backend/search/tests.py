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
        location = Location(story_id=story, location="location", latitude=15, longitude=20, type="Real")
        location.save()
        location2 = Location(story_id=story2, location="istanbul", latitude=20, longitude=20, type="Real")
        location2.save()
        location3 = Location(story_id=story3, location="kızılay", latitude=20, longitude=20, type="Real")
        location3.save()

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

    def test_search_location_geographical_query_dist_1(self):
        request = MockRequest(method='POST',body={"query_latitude": 15, "query_longitude": 20, "query_distance": 1, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_location_geographical_query_dist_0(self):
        request = MockRequest(method='POST',body={"query_latitude": 15, "query_longitude": 20, "query_distance": 0, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_location_geographical_query_dist_minus_5(self):
        request = MockRequest(method='POST',body={"query_latitude": 15, "query_longitude": 20, "query_distance": -5, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_location_geographical_query_dist_5(self):
        request = MockRequest(method='POST',body={"query_latitude": 18, "query_longitude": 20, "query_distance": 5, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_location_geographical_query_dist_2(self):
        request = MockRequest(method='POST',body={"query_latitude": 20, "query_longitude": 20, "query_distance": 2, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 2)

    def test_search_location_text_istanbul_combined(self):
        request = MockRequest(method='POST',body={"search_text": "istanbul", "query_latitude": 15, "query_longitude": 20, "query_distance": 2, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_location_text_istanbul_combined_far(self):
        request = MockRequest(method='POST',body={"search_text": "istanbul", "query_latitude": 25, "query_longitude": 20, "query_distance": 2, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_text_location_istanbul(self):
        request = MockRequest(method='POST',body={"location_text": "istanbul", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_text_location_location(self):
        request = MockRequest(method='POST',body={"location_text": "location", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_text_location_location_dot(self):
        request = MockRequest(method='POST',body={"location_text": "location.", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_text_location_ankara(self):
        request = MockRequest(method='POST',body={"location_text": "ankara", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_text_location_istanbul_spelling(self):
        request = MockRequest(method='POST',body={"location_text": "istanbu", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 1)

    def test_search_text_location_istanbul_spelling_search_text(self):
        request = MockRequest(method='POST',body={"search_text": "yes", "location_text": "istanbu", "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_min_latitude_zero(self):
        request = MockRequest(method='POST',body={"min_latitude": 0, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 3)

    def test_search_min_latitude_forty(self):
        request = MockRequest(method='POST',body={"min_latitude": 40, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_min_latitude_eighteen(self):
        request = MockRequest(method='POST',body={"min_latitude": 18, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 2)

    def test_search_min_latitude_eighteen_max_nineteen(self):
        request = MockRequest(method='POST',body={"min_latitude": 18, "max_latitude": 19, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)

    def test_search_min_latitude_eighteen_max_twentyone(self):
        request = MockRequest(method='POST',body={"min_latitude": 18, "max_latitude": 21, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 2)

    def test_search_min_latitude_eighteen_max_twentyone_longitude_in(self):
        request = MockRequest(method='POST',body={"min_latitude": 18, "max_latitude": 21, "min_longitude": 18, "max_longitude": 21, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 2)

    def test_search_min_latitude_eighteen_max_twentyone_longitude_out(self):
        request = MockRequest(method='POST',body={"min_latitude": 18, "max_latitude": 21, "min_longitude": 35, "max_longitude": 40, "page_number": 1, "page_size": 10})
        api = Search()
        response = api.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(len(response["return"]), 0)
