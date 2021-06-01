import unittest
from bson.objectid import ObjectId
import pymongo
import requests
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
posts = mydb["posts"]
attributes = set([  "id", "owner_username", 
                    "lastEdit", "location", 
                    "multimedia","postDate", 
                    "similarTags",  "story", 
                    "storyDate", "tags", 
                    "topic", "userComments"])

class TestPostDetail(unittest.TestCase):

    def test_empty_endpoint(self):
        response = requests.get("http://127.0.0.1:5000/api/viewPost/")
        self.assertEqual(response.status_code, 404)

    def test_post_not_found(self):
        response = requests.get("http://127.0.0.1:5000/api/viewPost/-1")
        self.assertEqual(response.status_code, 404)

    def test_api_call(self):
        response = requests.get("http://127.0.0.1:5000/api/viewPost/1")
        response_json = json.loads(response.text)
        self.assertEqual('similarTags' in response_json.keys(), True)

    def test_view_post(self):
        response = requests.get("http://127.0.0.1:5000/api/viewPost/1")
        response_json = json.loads(response.text)
        self.assertEqual(set(response_json.keys()),attributes)
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()