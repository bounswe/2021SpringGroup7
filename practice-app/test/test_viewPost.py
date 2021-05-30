import unittest
from bson.objectid import ObjectId
import pymongo
import requests
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
posts = mydb["posts"]
attributes = set(["_id", "owner", "lastEdit", "location", "multimedia","postDate", 
                                    "similarTags", 
                                    "story", 
                                    "storyDate", 
                                    "tags", 
                                    "topic", 
                                    "userComments"])

class TestPostDetail(unittest.TestCase):

    def test_empty_endpoint(self):
        response = requests.get("http://127.0.0.1:5000/api/postDetail/")
        self.assertEqual(response.status_code, 404)

    def test_db_post_existence(self):
         self.assertGreaterEqual(len(list(posts.find())), 1)

    def test_post_notfound(self):
        postId = posts.find_one({},{"_id":1})
        posts.delete_one({'_id' : postId})
        response = requests.get(f"http://127.0.0.1:5000/api/postDetail/{postId}")
        self.assertEqual(response.status_code, 500)
    
    def test_json_request(self):
        postId = str(posts.find_one({},{"_id":1})['_id'])
        response = requests.get(f"http://127.0.0.1:5000/api/postDetail/{postId}")
        self.assertEqual(response.status_code, 200)
        response_json = json.loads(response.text)
        self.assertEqual(set(response_json.keys()),attributes)              # make sure it returns right attributes


if __name__ == '__main__':
    unittest.main()