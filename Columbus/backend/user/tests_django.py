from django.test import TestCase
from .models import *
from django.contrib.auth.models import User
import ast
from .views import *

class MockRequest:
    def __init__(self, method, body, uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri

    def build_absolute_uri(self):
        return self.absolute_uri

class ModelTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        story_missing_numbers = Story.objects.create(title="title1", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01")
        story_missing_numbers.save()
        story_missing_time_end = Story.objects.create(title="title2", text="", multimedia="", user_id=user, time_start="2020-01-01")
        story_missing_time_end.save()
        story_missing_text = Story.objects.create(title="title3", multimedia="", user_id=user, time_start="2020-01-01")
        story_missing_text.save()
        tag = Tag.objects.create(story_id=story, tag="travel")
        tag.id = 3
        tag.save()
        location = Location(story_id=story, location="location")
        location.save()
        location_full = Location(story_id=story, location="location2", latitude=15, longitude=20, type="real")
        location_full.save()
        report = Report(story_id=story, reporter_id=user, report="report")
        report.save()
        comment = Comment(story_id=story, user_id=user, text="text")
        comment.save()
        profile = Profile(user_id=user)
        profile.save()

    def test_user_email_check(self):
        user = User.objects.get(username="user_name")
        self.assertEqual(user.email, "user_email@gmail.com")

    def test_missing_numbers_check(self):
        story = Story.objects.get(title="title1")
        self.assertEqual(story.numberOfLikes, 0)
        self.assertEqual(story.numberOfComments, 0)

    def test_missing_date_check(self):
        story = Story.objects.get(title="title2")
        self.assertEqual(story.time_end, None)

    def test_missing_text_check(self):
        story = Story.objects.get(title="title3")
        self.assertEqual(story.text, "")

    def test_user_check(self):
        story = Story.objects.get(title="title3")
        story2 = Story.objects.get(title="title2")
        self.assertEqual(story.user_id, story2.user_id)

    def test_tag_check(self):
        tag = Tag.objects.get(id=3)
        self.assertEqual(tag.tag, 'travel')

    def test_location_check(self):
        location = Location.objects.get(location="location")
        self.assertEqual(location.latitude, 0)
        self.assertEqual(location.longitude, 0)
        self.assertEqual(location.type, "")

    def test_location_full_check(self):
        location = Location.objects.get(location="location2")
        self.assertEqual(location.latitude, 15)
        self.assertEqual(location.longitude, 20)
        self.assertEqual(location.type, "real")

    def test_report_check(self):
        report = Report.objects.get(report="report")
        self.assertEqual(report.report, "report")

    def test_comment_check(self):
        comment = Comment.objects.get(text="text")
        self.assertEqual(comment.text, "text")

    def test_profile_check(self):
        profile = Profile.objects.get(user_id__username="user_name")
        self.assertEqual(profile.photo_url, None)
        self.assertEqual(profile.biography, None)
        self.assertEqual(profile.birthday, None)
        self.assertEqual(profile.location, None)


class HomePageTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        user2 = User.objects.create(username="user_name2", email="user_email2@gmail.com", password="123456", first_name="umut", last_name="umut")
        user2.save()
        story2 = Story.objects.create(title="title2", text="", multimedia="", user_id=user2, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story2.save()
        following = Following(user_id=user, follow=user2)
        following.save()


    def test_home_page(self):
        request = MockRequest(method='POST', body={"username": "user_name","page_number": 1,"page_size": 1})
        home_page_api = home_page.HomePage()
        response = home_page_api.post(request=request).content
        self.assertEqual(len(json.loads(response.decode('utf-8'))["return"]), 1)


class LogoutTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()

    def test_logout(self):
        request = MockRequest(method='POST', body={"username": "user_name"})
        home_page_api = logout.Logout()
        response = home_page_api.post(request=request).content
        self.assertEqual(len(json.loads(response.decode('utf-8'))["return"]["token"])>0, True)


class ProfileInformationTestCase(TestCase):
    user_id=0
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="hamza", last_name="hamza")
        self.user_id=user.id
        profile = Profile.objects.create(user_id=user,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05',location={"location": "asd", "latitude": 1901, "longitude": 120, "type": "Real"})
        user.save()
        profile.save()
    def test_get_profile_information(self):
        request = MockRequest(method='GET',body={})
        get_profile_info_api = profile.GetProfileInfo()
        response = get_profile_info_api.get(request=request,user_id=self.user_id).content
        expected_response = {'response': {'first_name': 'hamza', 'last_name': 'hamza', 'birthday': '2021-05-05', 'location':{"location": "asd", "latitude": 1901, "longitude": 120, "type": "Real"}, 'photo_url': 'temp.png', 'username': 'user_name', 'email': 'user_email@gmail.com', 'followers': [], 'followings': [], 'biography': 'temp likes being cool', 'user_id': 16}}
        self.assertEqual(json.loads(response.decode('utf-8')),expected_response)
