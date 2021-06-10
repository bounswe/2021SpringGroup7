import unittest
from unittest.mock import patch
from api.viewPost.viewPost import *
from werkzeug.exceptions import HTTPException


class TestPostDetail(unittest.TestCase):

    @patch('api.viewPost.viewPost.getPostInDb')
    def test_post_not_found(self, mockPost):
        mockPost.side_effect = [None]
        with self.assertRaises(HTTPException):
            viewPost(1)
    
 
    @patch('api.viewPost.viewPost.getPostInDb')
    def test_view_post(self, mockPost):
        mockPost.side_effect = [{'id' : 1, 'tags' : ['summer', 'musical'], 'isMock':True}]

        response = viewPost(1)

        expected = {'id' : 1, 'tags' : ['summer', 'musical']}
        
        self.assertEqual(response[1], 200) 
        self.assertTrue(all(item in response[0].items() for item in expected.items()))


if __name__ == '__main__':
    unittest.main()