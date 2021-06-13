from flask import json, Flask
from unittest.mock import patch, call
from werkzeug.exceptions import HTTPException
from api.likes.likes import *
from freezegun import freeze_time
import datetime
import unittest

class LikeTestCases(unittest.TestCase):
  
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['JSON_AS_ASCII'] = False
        self.app.config['TESTING'] = True

    @patch('api.likes.likes.findPostFromDb')
    @patch('api.likes.likes.getLikesFromDb')
    def test_get_likes_post(self, mockGetLikesFromDb, mockFindPostFromDb):
        mockFindPostDummy = [{
                'owner_username': 'ryan',
                'id'        : 2,
                'topic'     : 'Great Day In Rome...',
                'story'     : 'I was in Rome for about 3 months...',
                'location'  : 'Rome',
                'tags'      : ['summer', 'bike'],
                'numberOfLikes': 0,
                'numberOfComments': 13
            }]
        mockGetLikesDummy = [[{
                "username": 'onurcanavci',
                "postId": 2,
                "date": "Wed, 09 Jun 2021 08:48:36 GMT"
            }]]
        
        mockFindPostFromDb.side_effect = mockFindPostDummy
        mockGetLikesFromDb.side_effect = mockGetLikesDummy
        
        with self.app.app_context():
            response = getLikes(2)
        expected = {"items": [{
                        "date": "Wed, 09 Jun 2021 08:48:36 GMT",
                        "postId": 2,
                        "username": "onurcanavci"}],
                    "totalCount": 1}
        
        self.assertEqual(json.loads(response.data), expected)
        
    @patch('api.likes.likes.findPostFromDb')
    def test_get_like_post_with_false_postId(self, mockFindPostFromDb):  
        mockFindPostFromDb.side_effect = [None]

        with self.assertRaises(HTTPException):
            getLikes("notexisting")
          
    @patch('api.likes.likes.findPostFromDb')
    @patch('api.likes.likes.getLikesFromDb')
    def test_get_not_liked_post(self, mockGetLikesFromDb,mockFindPostFromDb):  
        mockFindPostDummy = [{
                'owner_username': 'ryan',
                'id'        : 2,
                'topic'     : 'Great Day In Rome...',
                'story'     : 'I was in Rome for about 3 months...',
                'location'  : 'Rome',
                'tags'      : ['summer', 'bike'],
                'numberOfLikes': 0,
                'numberOfComments': 13
            }]
        mockGetLikesFromDb.side_effect = [None]
        mockFindPostFromDb.side_effect = mockFindPostDummy
        with self.assertRaises(HTTPException):
            getLikes("notexisting")
          
    @patch('api.likes.likes.findPostFromDb')
    @patch('api.likes.likes.findUserFromDb')
    @patch('api.likes.likes.likedPostInfo')
    @patch('api.likes.likes.getLikesFromDb')
    @patch('api.likes.likes.addLikePostToDb')
    @patch('api.likes.likes.updatePostLikesDb')
    @freeze_time("2012-01-14")
    def test_user_like_post(self,mockUpdatePostLikesDb, mockAddLikePostToDb, mockGetLikesFromDb, mockLikedPostInfo,mockFindUserFromDb, mockFindPostFromDb ):
        mockFindPostDummy = [{
                "owner_username": "atainan",
                "id"        : 2,
                "topic"     : "Great Day In Rome...",
                "story"     : "I was in Rome for about 3 months...",
                "location"  : "Rome",
                "tags"      : ["summer", "bike"],
                "numberOfLikes": 0,
                "numberOfComments": 13              
            }]
        mockFindUserDummy = [{
                "username": "ryan",
                "first_name": "Randall",
                "last_name": "Degges",
                "email": "r@rdegges.com",
                "location": "Istanbul",
                "birthday": "29.02.2000",
                "isVisible": "False",
                "postIds": [1,2,4],
                "followRequests": [],
                "followers": ["atainan"],
                "followings": [],
                "savedPosts":[]
            }]  
        mockLikedPostInfoDummy = [{}] 
        mockGetLikesDummy = [{
                "username": 'onurcanavci',
                "postId": 2,
                "date": "Wed, 09 Jun 2021 08:48:36 GMT"
            }]
       
        mockFindPostFromDb.side_effect = mockFindPostDummy
        mockFindUserFromDb.side_effect = mockFindUserDummy
        mockLikedPostInfo.side_effect = mockLikedPostInfoDummy
        mockGetLikesFromDb.side_effect = mockGetLikesDummy
        
        assert datetime.datetime.now() == datetime.datetime(2012, 1, 14)
        response = likePost(2, "ryan")
        mockUpdatePostLikesDb.assert_called_once_with(2, 3)
        mockAddLikePostToDb.assert_called_once_with({
            "username": "ryan",
            "postId": 2,
            "date": datetime.datetime.now(),
        })
        expected = {"message": "Post liked successfully", "status": 200}

        self.assertEqual(response, expected)

    @patch('api.likes.likes.findPostFromDb')
    @patch('api.likes.likes.findUserFromDb')
    def test_like_user_not_found(self, mockFindUserFromDb,mockFindPostFromDb):  
        mockFindPostDummy = [{
                'owner_username': 'ryan',
                'id'        : 2,
                'topic'     : 'Great Day In Rome...',
                'story'     : 'I was in Rome for about 3 months...',
                'location'  : 'Rome',
                'tags'      : ['summer', 'bike'],
                'numberOfLikes': 0,
                'numberOfComments': 13
            }]
        mockFindUserFromDb.side_effect = [None]
        mockFindPostFromDb.side_effect = mockFindPostDummy
        with self.assertRaises(HTTPException):
            likePost("notexisting", "notexisting")
          
if __name__ == '__main__':
    unittest.main()