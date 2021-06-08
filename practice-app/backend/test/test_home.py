import unittest
from api.home.home import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch


class HomePageTestCases(unittest.TestCase):

    @patch('api.home.home.getUserFromDb')
    @patch('api.home.home.get_post_of_a_user')
    def test_homepage(self, mockPost,mockUser):
        dummyVars1 = [{'username': 'ryan','isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['atainan'], 'isMock':True}]
        mockUser.side_effect = dummyVars1
        dummyVars2=[{'posts':[{'id': '1','owner_username': 'atainan','postDate': 2022},{'id': '2','owner_username': 'atainan','postDate': 2021},{'id': '3','owner_username': 'atainan','postDate': 2019}]}]
        mockPost.side_effect = dummyVars2
        response =getHome('ryan')
        self.assertEqual(response[0]['id'], '1')
        self.assertEqual(response[2]['id'], '3')

    @patch('api.home.home.getUserFromDb')
    def test_none_user(self,mockUser):
        mockUser.side_effect = None
        with self.assertRaises(HTTPException):
            getHome("notexisting")

    @patch('api.home.home.getUserFromDb')
    def test_none_followings(self,mockUser):
        dummyVars1 = [{'username': 'ryan','isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': [], 'isMock':True}]
        mockUser.side_effect = dummyVars1
        with self.assertRaises(HTTPException):
            getHome("ryan")

    @patch('api.home.home.getUserFromDb')
    @patch('api.home.home.get_post_of_a_user')
    def test_none_posts(self,mockPost,mockUser):
        dummyVars1 = [{'username': 'ryan','isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['atainan'], 'isMock':True}]
        mockUser.side_effect = dummyVars1
        dummyVars2=None
        mockPost.side_effect = dummyVars2
        with self.assertRaises(HTTPException):
            getHome("ryan")

if __name__ == '__main__':
    unittest.main()







