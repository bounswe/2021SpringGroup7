import unittest
import pymongo
import requests

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
users = mydb["users"]

class TestStringMethods(unittest.TestCase):
    def test_empty_endpoint(self):
        response = requests.get("http://127.0.0.1:5000/api/home/")
        self.assertEqual(response.status_code, 404)

    def test_user_existence(self):
        self.assertGreaterEqual(len(list(users.find())), 1)

    def test_user_feed(self):
        response = requests.get('http://127.0.0.1:5000/api/home/atainan')
        self.assertGreaterEqual(len(response.json()['posts']),2)

    def test_bad_request(self):
        response = requests.get(f'http://127.0.0.1:5000/api/home/{1}')
        self.assertEqual(response.status_code, 404)
        response = requests.get(f'http://127.0.0.1:5000/api/home/{1.213}')
        self.assertEqual(response.status_code, 404)
        response = requests.get('http://127.0.0.1:5000/api/home/let\'s say this is a very very long text that might cause some problem for the application')
        self.assertEqual(response.status_code, 404)
        response = requests.get('http://127.0.0.1:5000/api/home/what/about/this?')
        self.assertEqual(response.status_code, 404)

    def test_sorted_post(self):
        response = requests.get('http://127.0.0.1:5000/api/home/atainan')
        self.assertGreaterEqual(response.json()['posts'][0]['postDate'], response.json()['posts'][1]['postDate'])







