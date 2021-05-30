import unittest
import pymongo
import requests
import json
import datetime

db = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = db["db"]
comments = mydb["comments"]


class TestStringMethods(unittest.TestCase):

    def test_of_comment_post(self):
        rsp = requests.post('http://127.0.0.1:5000/post/1/comments/new/erencan', {'text': 'I love this story'})
        print(len(list(comments.find({'postId': 1}, {'_id': False}))))
        self.assertEqual(len(list(comments.find({'postId': 1}, {'_id': False}))), 1)
        rsp = requests.post('http://127.0.0.1:5000/post/1/comments/new/atainan', {'text': 'I don\'t like this story'})
        self.assertEqual(len(list(comments.find({'postId': 1}, {'_id': False}))), 2)
        comments.delete_many({'postId':1})
    def test_of_tpapi(self):
        rsp = requests.post('http://127.0.0.1:5000/post/1/comments/new/erencan', {'text': 'Benim adım ali. 13 yaşındayım.'})
        self.assertEqual(rsp.json()["language"],"tr")
        comments.delete_many({'postId': 1})



if __name__ == '__main__':
    unittest.main()

