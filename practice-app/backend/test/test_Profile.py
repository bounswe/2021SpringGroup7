from app import app
from flask import json
from api.profile.profile import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch
import unittest

class ProfileTests(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True

    @patch('api.profile.profile.getUserFromDB')
    @patch('api.profile.profile.getPostsOfUser')
    def test_retrieve_real_user(self, mockPost, mockUser):
        userFromDB = [{
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'inanata15@gmail.com',
        'location': 'atasehir',
        'birthday': '29.02.2000',
        'isVisible': 'True',
        'postIds': [3],
        'followRequests': [],
        'followers': [],
        'followings': ['ryan'],
        'savedPosts':[]
        }]

        postsOfUser = [[{
            "id": 3, 
            "lastEdit": " ", 
            "location": "Rome", 
            "multimedia": [
                "photo_link_1", 
                "photo_link_2"
            ], 
            "numberOfComments": "15", 
            "numberOfLikes": "360", 
            "owner_username": "atainan", 
            "postDate": "Mon, 13 May 2019 12:04:40 GMT", 
            "story": "I was in Rome for about 3 months...", 
            "storyDate": {
                "end": "Wed, 01 Mar 2017 00:00:00 GMT", 
                "start": "Sun, 01 Jan 2017 00:00:00 GMT"
            }, 
            "tags": [
                "summer", 
                "bike"
            ], 
            "topic": "Great Day In Rome...", 
            "userComments": ""
        }]]

        mockUser.side_effect = userFromDB
        mockPost.side_effect = postsOfUser

        with app.app_context():
            resp = getProfile('atainan')
            data = json.loads(resp.get_data())

        expected = {
        "birthday": "29.02.2000",  
        "email": "inanata15@gmail.com", 
        "first_name": "ata", 
        "followRequests": [], 
        "followers": [], 
        "followings": [
            "ryan"
        ],  
        "isVisible": "True", 
        "last_name": "inan", 
        "location": "atasehir",  
        "nofFollowers": 0, 
        "nofFollowings": 1, 
        "nofRequests": 0, 
        "postIds": [
            3
        ], 
        "posts": [{
            "id": 3, 
            "lastEdit": " ", 
            "location": "Rome", 
            "multimedia": [
                "photo_link_1", 
                "photo_link_2"
            ], 
            "numberOfComments": "15", 
            "numberOfLikes": "360", 
            "owner_username": "atainan", 
            "postDate": "Mon, 13 May 2019 12:04:40 GMT", 
            "story": "I was in Rome for about 3 months...", 
            "storyDate": {
                "end": "Wed, 01 Mar 2017 00:00:00 GMT", 
                "start": "Sun, 01 Jan 2017 00:00:00 GMT"
            }, 
            "tags": [
                "summer", 
                "bike"
            ], 
            "topic": "Great Day In Rome...", 
            "userComments": ""
        }], 
        "savedPosts": [], 
        "username": "atainan"
        }

        self.assertEqual(resp.status_code, 200) 
        self.assertTrue(all(item in data.items() for item in expected.items()))

    
    @patch('api.profile.profile.getUserFromDB')
    def test_retrieve_nonexisting_user(self, mockUser):
        mockUser.side_effect = [None]
        with self.assertRaises(HTTPException):
            getProfile('notexisting')


    @patch('api.profile.profile.getRequest')
    @patch('api.profile.profile.getUserFromDB')
    @patch('api.profile.profile.updateUserInDB')
    def test_update_real_user(self, mockUpdate, mockUser, mockRequest):
        userFromDB = [{
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'inanata15@gmail.com',
        'location': 'atasehir',
        'birthday': '29.02.2000',
        'isVisible': 'True',
        'postIds': [3],
        'followRequests': [],
        'followers': [],
        'followings': ['ryan'],
        'savedPosts':[]
        }]

        postRequest = [{'first_name': 'ismail',
        'last_name': '',
        'email': '',
        'location': 'kadikoy',
        'birthday': '',
        'isVisible': 'False'}]

        mockUser.side_effect = userFromDB
        mockRequest.side_effect = postRequest

        with app.app_context():
            resp = updateProfile('atainan')
            
        expected = 'Success', 200

        self.assertEqual(resp, expected)


    @patch('api.profile.profile.getRequest')
    @patch('api.profile.profile.getUserFromDB')
    def test_update_nonexisting_user(self, mockUser, mockRequest):
        postRequest = [{'first_name': 'ismail',
        'last_name': '',
        'email': '',
        'location': 'kadikoy',
        'birthday': '',
        'isVisible': 'False'}]

        mockUser.side_effect = [None]
        mockRequest.side_effect = postRequest

        with self.assertRaises(HTTPException):
            updateProfile('notexisting')


    def test_thirdparty_api_response(self):
        resp = getLocationInfo('guney kampus')
        self.assertNotEqual(resp, ('','','',''))
        

if __name__ == '__main__':
    unittest.main()
