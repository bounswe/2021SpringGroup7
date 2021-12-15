import ast
from unittest import TestCase, mock
from .views.comment import *
from .views.follow import Follow
from .mock_objects import *
from django.core import serializers


class Tests(TestCase):
    @mock.patch("user.models.Story.objects.get")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    @mock.patch("user.views.comment.CommentCreate.create_comment")
    def test_comment_create(self, comment, getUser, getStory):
        comment.return_value = MockComment(username='comment', story_id='comment', text='created')
        getStory.return_value = Story(title="story", text="story", multimedia="story", user_id="story",
                                      time_start="13.12.2021", time_end="13.12.2021", createDateTime="13.12.2021"
                                      , lastUpdate="13.12.2021", numberOfLikes=5, numberOfComments=10)
        getUser.return_value = mock_create_user(username='unittest', email='user_email',
                                                password='unittest', first_name='unit', last_name='test', id=1)

        body = {
            'username': 'comment',
            'story_id': 'comment',
            'text': 'created',
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        comment_create = CommentCreate()
        response = comment_create.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'test'}

    @mock.patch("user.models.Comment.objects.get")
    def test_comment_update(self, comment):
        comment.return_value = MockComment(username='comment', story_id='comment', text='created')
        body = {
            'comment_id': 'test',
            'text': 'updated',
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        comment_update = CommentUpdate()
        response = comment_update.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        print(response)
        assert response == {'return': 'test'}

    @mock.patch("json.loads")
    @mock.patch("django.core.serializers.serialize")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    @mock.patch("user.models.Comment.objects.filter")
    def test_get_comment(self, comments, user, serialize, loads):
        serializer_class = MockCommentSerializer
        user.return_value = mock_create_user(username='yorumcu', email='yorumcu',
                                             password='yorumcu', first_name='yorumcu', last_name='yorumcu', id=1)
        comment1 = MockComment(username='comment1', story_id='comment1', text='created1')
        comment2 = MockComment(username='comment2', story_id='comment2', text='created2')
        comments_list = [comment1, comment2]
        comments.return_value = comments_list
        serialize.return_value = [serializer_class(each) for each in comments_list]
        loads.return_value = [{"fields": {"story_id": each.story_id,
                                          "user_id": each.username,
                                          "text": each.text}} for each in comments_list]
        body = {
            'story_id': 'test',
        }
        request = MockRequest(method='POST', body=body)
        comment_update = GetComment()
        response = comment_update.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))

        assert response == {'return': [{'story_id': 'comment1', 'user_id': 'comment1', 'text': 'created1', 'username': 'yorumcu'}, {'story_id': 'comment2', 'user_id': 'comment2', 'text': 'created2', 'username': 'yorumcu'}]}

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

