from app import app
from flask import json
from api.follow.follow import *
from unittest.mock import patch
from werkzeug.exceptions import HTTPException
import unittest


class FollowDetailsTestCases(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True

    @patch('api.follow.follow.getUserFromDb')
    def test_user_followings(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [
            {'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['ata']}]
        with app.app_context():
            resp = getFollowings("ryan")
            data = json.loads(resp.get_data())

        expected = ['ata']
        self.assertEqual(resp.status_code, 200)
        self.assertListEqual(data, expected)

    @patch('api.follow.follow.getUserFromDb')
    def test_followings_user_doesnt_exist(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [None]
        with self.assertRaises(HTTPException):
            getFollowings("")

    @patch('api.follow.follow.getUserFromDb')
    def test_user_followers(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [
            {'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': ['ata', 'onur'], 'followings': ['ata']}]
        with app.app_context():
            resp = getFollowers("ryan")
            data = json.loads(resp.get_data())

        expected = ['ata', 'onur']
        self.assertEqual(resp.status_code, 200)
        self.assertListEqual(data, expected)

    @patch('api.follow.follow.getUserFromDb')
    def test_followers_user_doesnt_exist(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [None]
        with self.assertRaises(HTTPException):
            getFollowers("")

    @patch('api.follow.follow.getUserFromDb')
    def test_user_follow_requests(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [
            {'username': 'ryan', 'isVisible': 'True', 'followRequests': ['umut', 'ramazan', 'rabia'], 'followers': [], 'followings': ['ata']}]
        with app.app_context():
            resp = getFollowRequests("ryan")
            data = json.loads(resp.get_data())

        expected = ['umut', 'ramazan', 'rabia']
        self.assertEqual(resp.status_code, 200)
        self.assertListEqual(data, expected)

    @patch('api.follow.follow.getUserFromDb')
    def test_follow_requests_user_doesnt_exist(self, mock_getUserFromDb):
        mock_getUserFromDb.side_effect = [None]
        with self.assertRaises(HTTPException):
            getFollowRequests("")


if __name__ == '__main__':
    unittest.main()