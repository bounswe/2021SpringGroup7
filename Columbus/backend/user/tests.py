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