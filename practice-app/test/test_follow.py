from ..follow.follow import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch
import unittest


class MyTestCase(unittest.TestCase):

    @patch('practice-app.follow.follow.getUserFromDb')
    @patch('practice-app.follow.follow.addToUserArrayInDb')
    def test_user_follow(self, mockGet, mockAdd):
        dummyVars = [{'username': 'ryan','isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': []},
                     {'username': 'ata', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': []}]
        mockGet.side_effect = dummyVars
        response = followUser('ryan', 'ata')
        expected = "Success", 200
        self.assertEqual(response, expected)

    @patch('practice-app.follow.follow.getUserFromDb')
    def test_user_is_already_followed(self, mockGet):
        dummyVars = [{'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['ata']},
                     {'username': 'ata', 'isVisible': 'True', 'followRequests': [], 'followers': ['ryan'], 'followings': []}]
        mockGet.side_effect = dummyVars
        resp = followUser('ryan', 'ata')
        expected = "Already followed", 200
        self.assertEqual(resp, expected)

    @patch('practice-app.follow.follow.getUserFromDb')
    def test_user_none(self, mockGet):
        mockGet.side_effect = [None, None]
        with self.assertRaises(HTTPException):
            followUser("notexisting", "notexisting")


if __name__ == '__main__':
    unittest.main()
