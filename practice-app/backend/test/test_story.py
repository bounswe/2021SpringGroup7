from werkzeug.wrappers import response
from api.story.story import *
from werkzeug.exceptions import HTTPException
from unittest.mock import patch
import unittest



class MyTestCase(unittest.TestCase):

    @patch('api.story.story.inputCheck')
    
    def test_create_story_without_location(self, mockGet):
        dummyVars = {"_id": {"$oid": "60bbf74e730f90192c54c0a2"}, "location_name": "      boğaziçi                        üniversitesi           ",
                    "story_ids": [3, 5, 7, 14, 53, 1356], "latitude": 38, "longitude": 45}
        testData = {
            "owner_username": "atainan",
            "story": "I was in Rome for about 3 months...",
            "multimedia": ["photo_link_1", "photo_link_2"],
            "tags": ["summer", "bike"],
            "location":"60bbf74e730f90192c54c0a2",
            "storyDate":{
                "start":"29-12-2020",
                "end":"29-01-2040"
            }


        }
        mockGet.side_effect = dummyVars
        with self.assertRaises(HTTPException):
            inputCheck(testData)

    @patch('api.story.story.inputCheck')
    def test_create_story_without_username(self, mockGet):
        dummyVars = {"_id": {"$oid": "60bbf74e730f90192c54c0a2"}, "location_name": "      boğaziçi                        üniversitesi           ",
                    "story_ids": [3, 5, 7, 14, 53, 1356], "latitude": 38, "longitude": 45}
        testData = {            
            "topic": "Great Day In Rome...",
            "story": "I was in Rome for about 3 months...",
            "multimedia": ["photo_link_1", "photo_link_2"],
            "tags": ["summer", "bike"],
            "location":"60bbf74e730f90192c54c0a2",
            "storyDate":{
                "start":"29-12-2020",
                "end":"29-01-2040"
            }


        }
        mockGet.side_effect = dummyVars
        with self.assertRaises(HTTPException):
            inputCheck(testData)
    @patch('api.story.story.inputCheck')
    def test_create_story_without_topic(self, mockGet):
        dummyVars = {"_id": {"$oid": "60bbf74e730f90192c54c0a2"}, "location_name": "      boğaziçi                        üniversitesi           ",
                    "story_ids": [3, 5, 7, 14, 53, 1356], "latitude": 38, "longitude": 45}
        testData = {            
            "owner_username": "atainan",
            "story": "I was in Rome for about 3 months...",
            "multimedia": ["photo_link_1", "photo_link_2"],
            "tags": ["summer", "bike"],
            "location":"60bbf74e730f90192c54c0a2",
            "storyDate":{
                "start":"29-12-2020",
                "end":"29-01-2040"
            }


        }
        mockGet.side_effect = dummyVars
        with self.assertRaises(HTTPException):
            inputCheck(testData)
    @patch('api.story.story.inputCheck')
    def test_create_story_positive(self, mockGet):
        dummyVars = {"_id": {"$oid": "60bbf74e730f90192c54c0a2"}, "location_name": "      boğaziçi                        üniversitesi           ",
                    "story_ids": [3, 5, 7, 14, 53, 1356], "latitude": 38, "longitude": 45}
        testData = {            
            "owner_username": "atainan",
            "story": "I was in Rome for about 3 months...",
            "multimedia": ["photo_link_1", "photo_link_2"],
            "tags": ["summer", "bike"],
            "location":"60bbf74e730f90192c54c0a2",
            "storyDate":{
                "start":"29-12-2020",
                "end":"29-01-2040"
            },
            "topic": "Great Day In Rome...",


        }
        mockGet.side_effect = dummyVars
        response=inputCheck(testData)
        expected=True
        self.assertEqual(response, expected)
    
if __name__ == '__main__':
    unittest.main()
