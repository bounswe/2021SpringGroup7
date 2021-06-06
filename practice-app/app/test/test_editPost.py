import unittest
from bson.objectid import ObjectId
import pymongo
import requests

import datetime

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
posts = mydb["posts"]

class TestPostDetail(unittest.TestCase):

    def test_empty_endpoint(self):
        response = requests.get("http://127.0.0.1:5000/api/postDetail/")
        self.assertEqual(response.status_code, 404)

    def test_db_post_existence(self):
         self.assertGreaterEqual(len(list(posts.find())), 1)

    def test_post_notfound(self):
        postId = str(posts.find_one({},{"_id":1}))
        posts.delete_one({'_id' : postId})
        response = requests.get(f"http://127.0.0.1:5000/api/postDetail/{postId}")
        self.assertEqual(response.status_code, 500)
    
    def test_badrequest_editpost(self):
        postId = str(posts.find_one({},{"_id":1})['_id'])
        response = requests.post(f'http://127.0.0.1:5000/api/postDetail/{postId}', {"postDate":datetime.datetime(2021, 5, 27, 12, 59, 40, 2)})
        self.assertEqual(response.status_code, 405)

    def test_not_owner(self):
        postId = str(posts.find_one({'owner':'atainan'},{'_id':1})['_id'])
        response = requests.get(f"http://127.0.0.1:5000/api/postDetail/ryan/{postId}")
        self.assertEqual(response.status_code, 405)
       

if __name__ == '__main__':
    unittest.main()