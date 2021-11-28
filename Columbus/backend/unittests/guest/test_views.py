from unittest import TestCase, mock
from django.http import JsonResponse
from Columbus.backend.guest.views import register
from Columbus.backend.unittests.guest.mock_objects import *


class TestRegister(TestCase):

    @mock.patch("confirmEmail")
    @mock.patch("User.objects.create_user")
    def test_register(self, create_user, confirmEmail):
        create_user.return_value = MockUserManager.create_user(username='unittest', email='user_email',
                                                           password='unittest', first_name='unit', last_name='test')
        confirmEmail.return_value = JsonResponse({'return':'Please confirm your email address to complete the registration'})
        body = {
            'user_name': 'unittest',
            'first_name': 'unit',
            'last_name': 'test',
            'user_email': 'user_email',
            'password': 'unittest',
        }
        request = MockRequest(method='POST', body=body)
        assert register(request) == {'return': 'user_email is succesfully created. Please confirm your e-mail to login'}