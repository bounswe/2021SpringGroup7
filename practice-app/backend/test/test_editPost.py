import unittest
from unittest.mock import patch
from werkzeug.exceptions import HTTPException
from api.editPost.editPost import *

import datetime

class TestPostDetail(unittest.TestCase):


    @patch('api.editPost.editPost.getUserInDb')
    @patch('api.editPost.editPost.getPostInDb')
    def test_post_not_found(self,  mockPost, mockUser):
        mockPost.side_effect = [None]
        mockUser.side_effect = [{'username' : 'atainan'}]
        with self.assertRaises(HTTPException):
            editPost('atainan', 1)

    @patch('api.editPost.editPost.getUserInDb')
    @patch('api.editPost.editPost.getPostInDb')
    def test_requested_by_not_found(self, mockPost, mockUser):
        postsFromDb = [{'owner_username': ' ', 'id': 3}]
        mockPost.side_effect = postsFromDb
        mockUser.side_effect = [None]
        with self.assertRaises(HTTPException):
            editPost('atainan', 3)

    @patch('api.editPost.editPost.getUserInDb')
    @patch('api.editPost.editPost.getPostInDb')
    def test_user_not_authorized(self, mockPost, mockUser): 
        postsFromDb = [ {'owner_username': 'ryan',  'id': 1},
                        {'owner_username': 'rabia', 'id': 2} ]
        usersFromDb = [{'username': 'ryan'}, {'username': 'rabia'}]
        mockPost.side_effect = postsFromDb
        mockUser.side_effect = usersFromDb
        with self.assertRaises(HTTPException):
            editPost('rabia',1)

    @patch('api.editPost.editPost.getRequest')
    @patch('api.editPost.editPost.getUserInDb')
    @patch('api.editPost.editPost.getPostInDb')
    def test_bad_edit_request(self, mockPost, mockUser, mockRequest):
        postsFromDb   = [ {'owner_username': 'rabia', 'id': 1, 'postDate' : datetime.datetime(2020, 8, 19, 12, 59, 40, 32)}]
        usersFromDb   = [ {'username': 'rabia'}]
        requestedEdit = [ {'postDate' : ''}]                # postDate cannot be edited
        mockPost.side_effect = postsFromDb
        mockUser.side_effect = usersFromDb
        mockRequest.side_effect = requestedEdit

        with self.assertRaises(HTTPException):
            editPost('rabia', 1)

    @patch('api.editPost.editPost.updatePostInDb')
    @patch('api.editPost.editPost.getRequest')
    @patch('api.editPost.editPost.getUserInDb')
    @patch('api.editPost.editPost.getPostInDb')
    def test_bad_edit_request(self, mockPost, mockUser, mockRequest, mockUpdate):
        postsFromDb   = [ {'owner_username': 'rabia', 'id': 1, 
                            'story' : 'When I was studying in Venice...', 'topic' : 'Interesting Coincidence'}]
        usersFromDb   = [ {'username': 'rabia'}]
        requestedEdit = [ {'story' : 'I changed my story for some reason...', 'topic' : 'Also topic was not good enough'}]               
       
        mockPost.side_effect = postsFromDb
        mockUser.side_effect = usersFromDb
        mockRequest.side_effect = requestedEdit

        response = editPost('rabia',1)

        expectedResponse = 'Successful Edit', 200
        self.assertEqual(response, expectedResponse)
       

if __name__ == '__main__':
    unittest.main()