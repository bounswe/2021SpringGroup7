import unittest
from unittest.mock import patch
from api.viewPost.viewPost import *
from werkzeug.exceptions import HTTPException
from errorHandlers import app

import json

class TestPostDetail(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True

    @patch('api.viewPost.viewPost.getPostInDb')
    def test_post_not_found(self, mockPost):
        mockPost.side_effect = [None]
        with self.assertRaises(HTTPException):
            viewPost(1)

    @patch('api.viewPost.viewPost.callSimilarTags')
    def test_api_call(self, mockPost):
        mockPost.side_effect = [{'id' : 1, 'tags' : ['summer', 'musical']}]
        postToBeViewed = {'id' : 1, 'tags' : ['summer', 'musical']}
        with app.app_context():
            response = callSimilarTags(postToBeViewed) 
        self.assertEqual(response[1], 200) 

        
    @patch('api.viewPost.viewPost.getPostInDb')
    def test_view_post(self, mockPost):
        mockPost.side_effect = [{'id' : 1, 'tags' : ['summer', 'musical']}]
        with app.app_context():
            response = viewPost(1)
            data = json.loads(response.get_data())

        expected = {'id' : 1, 'tags' : ['summer', 'musical']}
        
        self.assertEqual(response.status_code, 200) 
        self.assertTrue(all(item in data.items() for item in expected.items()))


if __name__ == '__main__':
    unittest.main()