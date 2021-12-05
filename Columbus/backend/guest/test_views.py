import ast
import json
from unittest import TestCase, mock
from django.http import JsonResponse
from .views import register, login, change_password, confirmEmail
from .mock_objects import *



class Tests(TestCase):

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

    @mock.patch("guest.views.authenticate")
    @mock.patch("guest.views.auth_login")
    def test_login(self, auth_login, authenticate):
        authenticate.return_value = mock_create_user(username='giris', email='giris',
                                                     password='basarili', first_name='basarili', last_name='oldu')
        auth_login.return_value = True
        body = {
            'user_name': 'username',
            'password': 'password',
        }
        body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        response = login(request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'Login is successful'}


    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_change_password(self, get):
        get.return_value = mock_create_user(username='giris', email='giris',
                                                     password='basarili', first_name='basarili', last_name='oldu')
        body = {
            'user_name': 'username',
            'password': 'newpassword',
        }
        body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        response = change_password(request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'Changing password is successful'}

    @mock.patch("guest.views.createEmail")
    def test_confirm_email(self, createEmail):
        user = mock_create_user(username='mail', email='gönderimi',
                                password='basarili', first_name='basarili', last_name='oldu')
        createEmail.return_value = mock_create_email(user)
        body = {}
        body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        response = confirmEmail(request=request,user=user).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'Please confirm your email address to complete the registration'}

