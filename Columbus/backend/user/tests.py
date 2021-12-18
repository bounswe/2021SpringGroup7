import ast
from unittest import TestCase, mock
from .views.comment import *
from .views.follow import Follow
from .views.like import LikePost, GetPostLikes
from .views.post import PostCreate
from .views.home_page import HomePage
from .mock_objects import *
from django.core import serializers


class Tests(TestCase):
    @mock.patch("user.views.follow.Follow.get_following")
    @mock.patch("user.models.Following.objects.filter")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_follow(self, get_user, following, get_follow):
        get_follow.return_value = MockFollow(user_id='user1', follow='user2')
        get_user.return_value = mock_create_user(username='username', email='email',
                                            password='password', first_name='user', last_name='name',id=1)
        following.return_value = MockFollow(user_id='user1', follow='user2')
        body = {
            'user_id': 'user1',
            'follow': 'user2',
            'action_follow': True
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        follow = Follow()
        response = follow.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'The user username has followed username'}

    @mock.patch("user.models.Like.objects.filter")
    @mock.patch("user.models.Story.objects.get")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_like_post(self, get_user, get_story, like_filter):
        like_filter.return_value = MockLike(user_id='user1', story_id='story1')
        get_user.return_value = mock_create_user(username='username', email='email',
                                            password='password', first_name='user', last_name='name',id=1)
        get_story.return_value = MockStory(title="story", text="story", multimedia="story", user_id="story",
                                      time_start="13.12.2021", time_end="13.12.2021", createDateTime="13.12.2021"
                                      , lastUpdate="13.12.2021", numberOfLikes=5, numberOfComments=10)
        body = {
            'user_id': 'user1',
            'story_id': 'story1',
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        like = LikePost()
        response = like.post(request=request).content
        response = json.loads(response)
        assert response == {"response": {"user_id": "user1", "story_id": "story1", "isLiked": False}}

    @mock.patch("user.models.Like.objects.filter")
    @mock.patch("user.models.Story.objects.get")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_get_post_likes(self, get_user, get_story, like_filter):

        like_filter.return_value = MockLike(user_id='user1', story_id='story1')
        get_user.return_value = mock_create_user(username='username', email='email',
                                            password='password', first_name='user', last_name='name',id=1)
        get_story.return_value = MockStory(title="story", text="story", multimedia="story", user_id="story",
                                      time_start="13.12.2021", time_end="13.12.2021", createDateTime="13.12.2021"
                                      , lastUpdate="13.12.2021", numberOfLikes=2, numberOfComments=10)
        body = {
            'story_id': 'story1',
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        post_likes = GetPostLikes()
        response = post_likes.get(story_id='story1',request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': {'like': ['user1', 'user2'], 'number_of_likes': 2}}

    @mock.patch("user.views.post.PostCreate.get_tag")
    @mock.patch("user.views.post.PostCreate.get_location")
    @mock.patch("user.views.post.PostCreate.create_story")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_post_create(self, get_user, create_story, get_location, get_tag):
        story1 = MockStory(title="story", text="story", multimedia="story", user_id="user2",
                                              time_start="13.12.2021", time_end="13.12.2021", createDateTime="13.12.2021"
                                              , lastUpdate="13.12.2021", numberOfLikes=0, numberOfComments=0)
        get_tag.return_value = MockTag(story_id=story1, tag="beauty")
        get_location.return_value = MockLocation(story_id=story1, location="bogazici", latitude=10, longitude=11, type="university")
        create_story.return_value = story1
        get_user.return_value = mock_create_user(username='username', email='email',
                                                 password='password', first_name='user', last_name='name', id=1)

        body = {
            'title': 'new post',
            'username': 'user1',
            'time_start': "2021-12-15",
            'location': [{'location': "bogazici",
                          'latitude': "10",
                          'longitude': "11",
                          'type': "university"}
                         ],
            'tags':  ["beauty"]
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        post_create = PostCreate()
        response = post_create.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'story1'}

    # @mock.patch("user.views.follow.Follow.get_following")
    # @mock.patch("user.models.Following.objects.filter")
    # @mock.patch("user.models.Story.objects.filter")
    # def test_home_page(self, story_list, following_list, get_follow):
    #     story1 = MockStory(title="story", text="story", multimedia="story", user_id="user2",
    #           time_start="13.12.2021", time_end="13.12.2021", createDateTime="13.12.2021"
    #           , lastUpdate="13.12.2021", numberOfLikes=5, numberOfComments=10)
    #     story2 = MockStory(title="story", text="story", multimedia="story", user_id="user2",
    #                                   time_start="13.12.2021", time_end="13.12.2021", createDateTime="13.12.2021"
    #                                   , lastUpdate="13.12.2021", numberOfLikes=5, numberOfComments=10)
    #     story_list.return_value = [story1, story2]
    #     follow1 = MockFollow(user_id='user1', follow='user2')
    #     follow2 = MockFollow(user_id='user1', follow='user3')
    #     following_list.return_value = [follow1,follow2]
    #     body = {
    #         'username': 'user1',
    #         'page_number': 1,
    #         'page_size': 10
    #     }
    #     # body = bytes(json.dumps(body), 'utf-8')
    #     request = MockRequest(method='POST', body=body)
    #     home_page = HomePage()
    #     response = home_page.post(request=request).content
    #     response = ast.literal_eval(response.decode('utf-8'))
    #     print(response)
    #     assert response == {'return': 'The user username has followed username'}
