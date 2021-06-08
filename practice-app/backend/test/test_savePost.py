import unittest
from flask import Blueprint,Flask
from api.savePost.savePost import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch
import mock
class TestStringMethods(unittest.TestCase):
    @patch('api.savePost.savePost.getUserFromDb')
    @patch('api.savePost.savePost.getPostFromDb')
    @patch('api.savePost.savePost.setUserInDb')
    @patch('api.savePost.savePost.getRequest')
    def test_successful_savePost(self, mockRequest,mockAdd,mockPost,mockUser):
        userFromDb = [{'username': 'ryan','isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': [], 'savedPosts':[],'isMock':True}]
        postsFromDb =[{'id':1}]
        postRequest=[{'id':1}]
        mockUser.side_effect=userFromDb
        mockPost.side_effect=postsFromDb
        mockRequest.side_effect=postRequest
        response=savePost('ryan')
        expected=('Successful Add', 200)
        self.assertEqual(expected,response)

    @patch('api.savePost.savePost.getUserFromDb')
    @patch('api.savePost.savePost.getPostFromDb')
    @patch('api.savePost.savePost.setUserInDb')
    @patch('api.savePost.savePost.getRequest')
    def test_post_notInDb(self, mockRequest, mockAdd, mockPost, mockUser):
        userFromDb = [{'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': [],
                       'savedPosts': [], 'isMock': True}]
        postsFromDb = [{'id': 1}]
        postRequest = [{'id': 2}]
        mockUser.side_effect = userFromDb
        mockPost.side_effect = postsFromDb
        mockRequest.side_effect = postRequest
        with self.assertRaises(HTTPException):
            savePost('ryan')

    @patch('api.savePost.savePost.getUserFromDb')
    @patch('api.savePost.savePost.getPostFromDb')
    @patch('api.savePost.savePost.setUserInDb')
    @patch('api.savePost.savePost.getRequest')
    def test_post_duplicate_saving(self, mockRequest, mockAdd, mockPost, mockUser):
        userFromDb = [{'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': [],
                       'savedPosts': [1], 'isMock': True}]
        postsFromDb = [{'id': 1}]
        postRequest = [{'id': 1}]
        mockUser.side_effect = userFromDb
        mockPost.side_effect = postsFromDb
        mockRequest.side_effect = postRequest
        response=savePost('ryan')
        expected = ('The post is already saved', 200)
        self.assertEqual(response,expected)

    @patch('api.savePost.savePost.getUserFromDb')
    @patch('api.savePost.savePost.getPostFromDb')
    @patch('api.savePost.savePost.setUserInDb')
    @patch('api.savePost.savePost.getRequest')
    def test_user_badRequest(self, mockRequest, mockAdd, mockPost, mockUser):
        userFromDb = [{'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': [],
                       'savedPosts': [1], 'isMock': True}]
        postsFromDb = [{'id': 1}]
        postRequest = [{'id': 1}]
        mockUser.side_effect = userFromDb
        mockPost.side_effect = postsFromDb
        mockRequest.side_effect = postRequest
        with self.assertRaises(HTTPException):
            savePost('atainan')














