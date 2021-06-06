import unittest
import pymongo
import requests

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
users = mydb["users"]
posts = mydb["posts"]

#'/api/<string:username>/savings/'

class TestStringMethods(unittest.TestCase):
    def test_user_existence(self):
        self.assertGreaterEqual(len(list(users.find())), 1)

    def test_post_existence(self):
        self.assertGreaterEqual(len(list(posts.find())), 1)

    def test_bad_request1(self):
        response = requests.post('http://127.0.0.1:5000/api/atainan/savings/', {"id":"dummy"})
        self.assertEqual(response.status_code, 400)

    def test_multiple_saving_for_one_post(self):
        response = requests.post('http://127.0.0.1:5000/api/atainan/savings/', {'id': 1})
        self.assertEqual(response.status_code, 200)
        response = requests.post('http://127.0.0.1:5000/api/atainan/savings/', {'id': 1})
        self.assertEqual(response.status_code, 200)
        response = requests.get('http://127.0.0.1:5000/user/atainan').json()[0]['savedPost']
        check=(len(response) == len(set(response)))
        self.assertTrue(check)

    def test_successful_request(self):
        response = requests.post('http://127.0.0.1:5000/api/atainan/savings/', {'id': 1})
        self.assertEqual(response.status_code, 200)


