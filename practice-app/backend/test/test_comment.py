import unittest
from flask import json, request, jsonify
from app import app
from datetime import datetime
from api.comment.comment import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch, call, MagicMock


class CommentTestCases(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True

    @patch('api.comment.comment.getCommentFromDb')
    @patch('api.comment.comment.getPostFromDb')
    def test_getcomment_success(self, mock_getPostFromDb, mock_getCommentFromDb ):
        dummyVars = [{ "username": 'atainan', "comment": 'adfadfad', "postId": 3, "date": '', "language": 'tr' },
                     { "username": 'atainan', "comment": 'adfadfad', "postId": 3, "date": '', "language": 'tr' }]
        mock_getCommentFromDb.return_value = dummyVars
        dummypost = {
        'owner_username': 'atainan',
        'id'        : 3,
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : '',
        'storyDate' : '',
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'bike'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': '360',
        'numberOfComments': 15 }
        mock_getPostFromDb.side_effect = dummypost
        with app.app_context():
            response = getComments(3)
            data = json.loads(response.get_data())

        self.assertEqual(data, dummyVars)

    @patch('api.comment.comment.getCommentFromDb')
    @patch('api.comment.comment.getPostFromDb')
    def test_getcomment_postnotfound(self, mock_getPostFromDb, mock_getCommentFromDb):
        dummyVars = [{"username": 'atainan', "comment": 'adfadfad', "postId": 3, "date": '', "language": 'tr'},
                     {"username": 'atainan', "comment": 'adfadfad', "postId": 3, "date": '', "language": 'tr'}]
        mock_getCommentFromDb.return_value = dummyVars
        dummypost = [None]
        mock_getPostFromDb.side_effect = dummypost
        with self.assertRaises(HTTPException):
            getComments(3)

    @patch('api.comment.comment.getCommentFromDb')
    @patch('api.comment.comment.getPostFromDb')
    def test_getcomment_usernotfound(self, mock_getPostFromDb, mock_getCommentFromDb):
        dummyVars = [None]
        mock_getCommentFromDb.side_effect = dummyVars
        dummypost = {
            'owner_username': 'atainan',
            'id': 3,
            'topic': 'Great Day In Rome...',
            'story': 'I was in Rome for about 3 months...',
            'location': 'Rome',
            'postDate': '',
            'storyDate': '',
            'multimedia': ['photo_link_1', 'photo_link_2'],
            'tags': ['summer', 'bike'],
            'lastEdit': ' ',
            'numberOfLikes': '360',
            'numberOfComments': 15}
        mock_getPostFromDb.side_effect = dummypost
        with self.assertRaises(HTTPException):
            getComments(3)


    @patch('api.comment.comment.getUserFromDb')
    @patch('api.comment.comment.getPostFromDb')
    def test_postcomment_success(self, mock_getPostFromDb, mock_getUserFromDb):
        with app.test_request_context(
                '/api/post/3/comments/new/atainan', data={'text': 'I love this story'}):
            dummyUser = [
                {'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['ata']}]
            mock_getUserFromDb.side_effect = dummyUser
            dummypost = [{
                'owner_username': 'atainan',
                'id': 3,
                'topic': 'Great Day In Rome...',
                'story': 'I was in Rome for about 3 months...',
                'location': 'Rome',
                'postDate': '',
                'storyDate': '',
                'multimedia': ['photo_link_1', 'photo_link_2'],
                'tags': ['summer', 'bike'],
                'lastEdit': ' ',
                'numberOfLikes': '360',
                'numberOfComments': 15}]
            mock_getPostFromDb.side_effect = dummypost
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M")
            response = makeComment(3,'atainan')
            data = json.loads(response.get_data())
            expected={ "username": 'atainan', "comment": 'I love this story', "postId": 3, "date": dt_string, "language": 'en' }

        self.assertEqual(data,expected)

    @patch('api.comment.comment.getUserFromDb')
    @patch('api.comment.comment.getPostFromDb')
    def test_postcomment_usernotfound(self, mock_getPostFromDb, mock_getUserFromDb):
        with app.test_request_context(
                '/api/post/3/comments/new/atainan', data={'text': 'I love this story'}):
            dummyUser = [None]
            mock_getUserFromDb.side_effect = dummyUser
            dummypost = [{
                'owner_username': 'atainan',
                'id': 3,
                'topic': 'Great Day In Rome...',
                'story': 'I was in Rome for about 3 months...',
                'location': 'Rome',
                'postDate': '',
                'storyDate': '',
                'multimedia': ['photo_link_1', 'photo_link_2'],
                'tags': ['summer', 'bike'],
                'lastEdit': ' ',
                'numberOfLikes': '360',
                'numberOfComments': 15}]
            mock_getPostFromDb.side_effect = dummypost

        with self.assertRaises(HTTPException):
            makeComment(3, 'atainan')

    @patch('api.comment.comment.getUserFromDb')
    @patch('api.comment.comment.getPostFromDb')
    def test_postcomment_postnotfound(self, mock_getPostFromDb, mock_getUserFromDb):
        with app.test_request_context(
                '/api/post/3/comments/new/atainan', data={'text': 'I love this story'}):
            dummyUser = [
                {'username': 'ryan', 'isVisible': 'True', 'followRequests': [], 'followers': [], 'followings': ['ata']}]
            mock_getUserFromDb.side_effect = dummyUser
            dummypost = [None]
            mock_getPostFromDb.side_effect = dummypost

        with self.assertRaises(HTTPException):
            makeComment(3, 'atainan')

if __name__ == '__main__':
    unittest.main()

