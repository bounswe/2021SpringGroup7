from app import app
from api.follow.follow import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch, call
import unittest


class FollowTestCases(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True

    @patch('api.follow.follow.getUserFromDb')
    @patch('api.follow.follow.addToUserArrayInDb')
    def test_user_follow(self, mock_addToUserArrayInDb, mock_getUserFromDb):
        dummyVars = [{"_id": 12, 'username': 'ryan','isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': []},
                     {"_id": 13, 'username': 'ata', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': []}]
        mock_getUserFromDb.side_effect = dummyVars

        response = followUser('ryan', 'ata')
        expected = "Success", 200

        mock_addToUserArrayInDb.has_calls(call(12, 'ata', 'followings'), call(13, 'ryan', 'followers'))
        self.assertEqual(response, expected)

    @patch('api.follow.follow.getUserFromDb')
    def test_user_is_already_followed(self, mock_getUserFromDb):
        dummyVars = [{"_id": 12, 'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['ata']},
                     {"_id": 13, 'username': 'ata', 'isVisible': 'True', 'followRequests': [], 'followers': ['ryan'], 'followings': []}]
        mock_getUserFromDb.side_effect = dummyVars

        resp = followUser('ryan', 'ata')
        expected = "Already followed", 200

        self.assertEqual(resp, expected)

    @patch('api.follow.follow.getUserFromDb')
    @patch('api.follow.follow.addToUserArrayInDb')
    def test_user_requested_follow(self, mock_addToUserArrayInDb, mock_getUserFromDb):
        dummyVars = [
            {"_id": 12,'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': []},
            {"_id": 13, 'username': 'ata', 'isVisible': 'False', 'followRequests': [], 'followers': [], 'followings': []}]
        mock_getUserFromDb.side_effect = dummyVars

        resp = followUser('ryan', 'ata')
        expected = "Success", 200

        mock_addToUserArrayInDb.assert_called_once_with(13, 'ryan', 'followRequests')
        self.assertEqual(resp, expected)

    @patch('api.follow.follow.getUserFromDb')
    def test_user_none(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [None, None]

        with self.assertRaises(HTTPException):
            followUser("notexisting", "notexisting")


if __name__ == '__main__':
    unittest.main()
