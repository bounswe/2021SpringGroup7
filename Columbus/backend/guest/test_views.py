import ast
import json
from unittest import TestCase, mock
from django.http import JsonResponse
from .views import register
from .mock_objects import *


class TestRegister(TestCase):

    @mock.patch("guest.views.confirmEmail")
    @mock.patch("django.contrib.auth.models.User.objects.create_user")
    def test_register(self, create_user, confirmEmail):
        create_user.return_value = mock_create_user(username='unittest', email='user_email',
                                                    password='unittest', first_name='unit', last_name='test')
        confirmEmail.return_value = JsonResponse(
            {'return': 'Please confirm your email address to complete the registration'})
        body = {
            'user_name': 'unittest',
            'first_name': 'unit',
            'last_name': 'test',
            'user_email': 'user_email',
            'password': 'unittest',
        }
        body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        response = register(request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'unittest is succesfully created. Please confirm your e-mail to login'}
