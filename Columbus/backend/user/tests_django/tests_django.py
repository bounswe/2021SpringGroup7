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
        logout_api = logout.Logout()
        response = logout_api.post(request=request).content
        self.assertEqual(len(json.loads(response.decode('utf-8'))["return"]["token"])>0, True)

class ProfileInformationTestCase(TestCase):
    user_id=0
    user=None
    user_temp=None
    story_user=None
    story_temp=None
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="hamza", last_name="hamza")
        temp_user = User.objects.create(username="temp_name", email="temp_email@gmail.com", password="123456", first_name="temp", last_name="temp")

        self.user_id=user.id
        self.user=user
        self.user_temp = temp_user
        profile = Profile.objects.create(user_id=user,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05')
        story_user = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story_temp = Story.objects.create(title="title", text="", multimedia="", user_id=temp_user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        self.story_temp=story_temp
        self.story_user=story_user
        user.save()
        profile.save()
    def test_get_profile_information(self):
        request = MockRequest(method='GET',body={},user=self.user)
        get_profile_info_api = profile.GetProfileInfo()
        response = get_profile_info_api.get(request=request,user_id=self.user_id).content
        expected_response = {'response': {'first_name': 'hamza', 'last_name': 'hamza', 'birthday': '2021-05-05', 'photo_url': 'temp.png', 'username': 'user_name', 'email': 'user_email@gmail.com', 'followers': [], 'followings': [], 'biography': 'temp likes being cool','user_id':self.user_id,'public':True}}
        self.assertEqual(json.loads(response.decode('utf-8')),expected_response)

    def test_set_profile_information(self):
        request = MockRequest(method='POST', body={'user_id':self.user_id,'first_name': 'changed_hamza', 'last_name': 'changed_hamza', 'birthday': '2021-06-06','photo_url': 'changed_temp.png','biography': 'changed temp likes being cool','public':False})
        set_profile_info_api = profile.SetProfileInfo()
        response = set_profile_info_api.post(request=request).content
        expected_response = {'response': {'first_name': 'changed_hamza', 'last_name': 'changed_hamza', 'birthday': '2021-06-06','photo_url': 'changed_temp.png', 'username': 'user_name', 'email': 'user_email@gmail.com', 'biography': 'changed temp likes being cool','user_id':self.user_id,'public':False}}

        self.assertEqual(json.loads(response.decode('utf-8')), expected_response)

    def test_delete_profile(self):
        request = MockRequest(method='GET', body={'user_id':self.user_id,'password':'123456'}, user=self.user)
        delete_profile_api = profile.DeleteProfile()
        response = delete_profile_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8')),{'response': 'Provide valid password'}
)

    def test_get_shared_posts(self):
        request = MockRequest(method='POST', body={'username':self.user.username,'page_number':1, 'page_size':1})
        get_shared_posts_api = profile_post.ProfilePost()
        response = get_shared_posts_api.post(request=request).content
        response = json.loads(response.decode('utf-8'))['return'][0]
        response.pop('createDateTime')
        response.pop('lastUpdate')
        response = {'return':[response]}
        expected_response = {'return': [{'title': 'title', 'text': '', 'multimedia': '', 'user_id': self.user_id, 'time_start': '2020-01-01', 'time_end': '2021-01-01', 'numberOfLikes': 0, 'numberOfComments': 0, 'owner_username': self.user.username, 'is_liked': False, 'story_id': self.story_user.id, 'locations': [], 'tags': [], 'photo_url': 'temp.png'}]}
        self.assertEqual(response,expected_response)

    def test_get_liked_posts(self):
        request = MockRequest(method='POST', body={'user_id': self.user.id, 'story_id': self.story_temp.id})
        like_post_api = like.LikePost()
        response = like_post_api.post(request=request).content
        expected_response = {'response': {'user_id': self.user.id, 'story_id': self.story_temp.id, 'isLiked': True}}
        self.assertEqual(json.loads(response.decode('utf-8')), expected_response)

        request = MockRequest(method='POST', body={'username':self.user.username,'page_number':1, 'page_size':1},user=self.user)
        get_liked_posts_api = like.GetUserLikes()
        response = get_liked_posts_api.post(request=request).content
        response = json.loads(response.decode('utf-8'))['return'][0]
        response.pop('createDateTime')
        response.pop('lastUpdate')
        response = {'return':[response]}
        expected_response = {'return': [{'title': 'title', 'text': '', 'multimedia': '', 'user_id': self.user_temp.id, 'time_start': '2020-01-01', 'time_end': '2021-01-01', 'numberOfLikes': 1, 'numberOfComments': 0, 'owner_username': 'temp_name', 'is_liked': True, 'story_id': self.story_temp.id, 'locations': [], 'tags': [], 'photo_url': None}]}

        self.assertEqual(response,expected_response)

class PostEditTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        story.id = 1
        story.save()

    def test_post_edit(self):
        request = MockRequest(method='POST', body={"story_id": 1, "title": "new title"})
        post_edit_api = post.PostEdit()
        response = post_edit_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 1)

    def test_post_edit_check(self):
        request = MockRequest(method='POST', body={"story_id": 1, "title": "new title"})
        post_edit_api = post.PostEdit()
        response = post_edit_api.post(request=request).content
        new_story = Story.objects.get(id = 1)
        self.assertEqual(new_story.title, "new title")


class PostDeleteTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        story.id = 1
        story.save()

    def test_post_delete_success(self):
        request = MockRequest(method='POST', body={"story_id": 1})
        post_delete_api = post.PostDelete()
        response = post_delete_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 'successful')

    def test_post_delete_fail(self):
        request = MockRequest(method='POST', body={"story_id": 2})
        post_delete_api = post.PostDelete()
        response = post_delete_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 'story not found')

class CommentCreateTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        story.id = 1
        story.save()

    def test_create_comment(self):
        request = MockRequest(method='POST', body={"username": "user_name", "story_id":1 , "text" : "new text","parent_comment_id":None})
        comment_create_api = comment.CommentCreate()
        response = comment_create_api.post(request=request).content
        self.assertEqual(type(json.loads(response.decode('utf-8'))["return"]), int)

    def test_not_found_story_for_comment(self):
        request = MockRequest(method='POST', body={"username": "user_name", "story_id": 10, "text": "new text","parent_comment_id":None})
        comment_create_api = comment.CommentCreate()
        response = comment_create_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 'story not found')

class CommentUpdateTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        story.id = 1
        story.save()
        comment = Comment(story_id=story, text="new text", user_id=user)
        comment.id = 1
        comment.save()

    def test_update_comment(self):
        request = MockRequest(method='POST', body={"comment_id": 1, "text": "updated text"})
        comment_update_api = comment.CommentUpdate()
        response = comment_update_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 1)

    def test_not_found_comment_for_comment(self):
        request = MockRequest(method='POST', body={"comment_id": 10, "text": "updated text"})
        comment_update_api = comment.CommentUpdate()
        response = comment_update_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 'comment not found')

class CommentDeleteTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        story.save()
        story.id = 1
        story.save()
        comment = Comment(story_id=story, text="new text", user_id=user)
        comment.id = 1
        comment.save()

    def test_delete_comment(self):
        request = MockRequest(method='POST', body={"comment_id": 1})
        comment_delete_api = comment.CommentDelete()
        response = comment_delete_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], "successful")

    def test_not_found_comment_for_comment(self):
        request = MockRequest(method='POST', body={"comment_id": 10})
        comment_delete_api = comment.CommentDelete()
        response = comment_delete_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 'comment not found')


class GetCommentTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        profile = Profile.objects.create(user_id=user,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05')
        story.save()
        story.id = 1
        story.save()
        comment = Comment(story_id=story, text="new text", user_id=user)
        comment.id = 1
        comment.save()

    def test_get_comment(self):
        request = MockRequest(method='POST', body={"story_id": 1})
        get_comment_api = comment.GetComment()
        response = get_comment_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"]['comments'][0]['story_id'],1)
        self.assertEqual(json.loads(response.decode('utf-8'))["return"]['comments'][0]['text'], "new text")

class PostCreateTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()

    def test_post_create(self):
        request = MockRequest(method='POST', body={"title":"title", "text":"", "multimedia":"", "username":"user_name", "time_start":"2020-01-01",
                                                   "time_end":"2021-01-01", "numberOfLikes":0, "numberOfComments":0,
                                                   "location": [{'location':"bogazici", 'latitude':10, 'longitude':11, 'type':"school"}] })
        post_create_api = post.PostCreate()
        response = post_create_api.post(request=request).content
        story = Story.objects.get(time_start="2020-01-01")
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], story.id)

    def test_post_create_check(self):
        request = MockRequest(method='POST',
                              body={"title": "title", "text": "", "multimedia": "", "username": "user_name",
                                    "time_start": "2020-01-01",
                                    "time_end": "2021-01-01", "numberOfLikes": 0, "numberOfComments": 0,
                                    "location": [
                                        {'location': "bogazici",'longitude': 11, 'type': "school"}]})
        post_create_api = post.PostCreate()
        response = post_create_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["return"], 'location not in appropriate format')

class LikePostTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="user_name1", email="user_email@gmail.com", password="123456", first_name="umut", last_name="umut")
        user.save()
        self.user_id=user.id
        story = Story.objects.create(title="title", text="", multimedia="", user_id=user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        profile = Profile.objects.create(user_id=user,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05')
        story.save()
        story.id = 1
        story.save()

    def test_like_post(self):
        request = MockRequest(method='POST', body={"user_id": self.user_id, "story_id":1})
        like_post_api = like.LikePost()
        response = like_post_api.post(request=request).content
        self.assertEqual(json.loads(response.decode('utf-8'))["response"], {"user_id": self.user_id, "story_id": 1, "isLiked": True})

    def test_get_post_like(self):
        request = MockRequest(method='POST', body={"user_id": self.user_id, "story_id":1})
        like_post_api = like.LikePost()
        response =  like_post_api.post(request=request).content
        request = MockRequest(method='GET', body={})
        like_post_api = like.GetPostLikes()
        response = like_post_api.get(request=request,story_id=1).content
        self.assertEqual(json.loads(response.decode('utf-8')), {'return': {'like': [{'user_id': self.user_id, 'username': 'user_name1', 'photo_url': 'temp.png'}], 'number_of_likes': 1}})


