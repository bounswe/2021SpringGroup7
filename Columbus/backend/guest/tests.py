import ast
from unittest import TestCase, mock
from django.http import JsonResponse
from .views import Register, Login, ChangePassword, confirmEmail, activate
from .mock_objects import *
import json



class Tests(TestCase):

    @mock.patch("guest.views.confirmEmail")
    @mock.patch("django.contrib.auth.models.User.objects.create_user")
    def test_register(self, create_user, confirmEmail):
        create_user.return_value = mock_create_user(username='unittest', email='user_email',
                                                    password='unittest', first_name='unit', last_name='test', id=1)
        confirmEmail.return_value = JsonResponse(
            {'return': 'Please confirm your email address to complete the registration'})
        body = {
            'username': 'unittest',
            'first_name': 'unit',
            'last_name': 'test',
            'email': 'user_email',
            'password': 'unittest',
        }
        # body = bytes(json.dumps(body), 'utf-8')
        request = MockRequest(method='POST', body=body)
        register = Register()
        response = register.post(request=request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'unittest is succesfully created. Please confirm your e-mail to login'}

    @mock.patch("django.contrib.auth.models.User.objects.get")
    @mock.patch("guest.views.Token")
    @mock.patch("guest.views.authenticate")
    @mock.patch("guest.views.auth_login")
    def test_login(self, auth_login, authenticate, token, get):
        token.objects.get_or_create.return_value = ("String", True)
        get.return_value = mock_create_user(username='giris', email='giris',
                                                     password='basarili', first_name='basarili', last_name='oldu', id=1)
        authenticate.return_value = mock_create_user(username='giris', email='giris',
                                                     password='basarili', first_name='basarili', last_name='oldu', id=1)
        auth_login.return_value = True
        body = {
            'username': 'username',
            'password': 'password',
        }
        request = MockRequest(method='POST', body=body)
        login = Login()
        response = login.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        assert response == {'return': {'first_name': 'basarili', 'last_name': 'oldu','photo_url':None ,'user_id': 1, 'token': 'String'}}


    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_change_password(self, get):
        get.return_value = mock_create_user(username='giris', email='giris',
                                                     password='basarili', first_name='basarili', last_name='oldu', id=1)
        body = {
            'username': 'username',
            'password': 'newpassword',
        }
        request = MockRequest(method='POST', body=body)
        change_password = ChangePassword()
        response = change_password.post(request).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'Changing password is successful'}

    @mock.patch("guest.views.createEmail")
    def test_confirm_email(self, createEmail):
        user = mock_create_user(username='mail', email='gönderimi',
                                password='basarili', first_name='basarili', last_name='oldu', id=1)
        createEmail.return_value = mock_create_email(user)
        body = {}
        request = MockRequest(method='POST', body=body)
        response = confirmEmail(request=request,user=user).content
        response = ast.literal_eval(response.decode('utf-8'))
        assert response == {'return': 'Please confirm your email address to complete the registration'}

    @mock.patch("guest.views.redirect")
    @mock.patch("guest.views.account_activation_token")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_activate_production(self, get, account_activation_token, redirect):
        account_activation_token.check_token.result_value = True
        get.return_value = mock_create_user(username='giris', email='giris',
                                            password='basarili', first_name='basarili', last_name='oldu',id=1)
        redirect.return_value = "production"
        body = {}
        request = MockRequest(method='POST', body=body, uri="ec2-35")
        assert "production" == activate(request=request, uidb64="user", token="token")

    @mock.patch("guest.views.redirect")
    @mock.patch("guest.views.account_activation_token")
    @mock.patch("django.contrib.auth.models.User.objects.get")
    def test_activate_development(self, get, account_activation_token, redirect):
        account_activation_token.check_token.result_value = True
        get.return_value = mock_create_user(username='giris', email='giris',
                                            password='basarili', first_name='basarili', last_name='oldu',id=1)
        redirect.return_value = "development"
        body = {}
        request = MockRequest(method='POST', body=body, uri="ec2-18")
        assert "development" == activate(request=request, uidb64="user", token="token")
