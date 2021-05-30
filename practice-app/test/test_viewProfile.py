import unittest
import pymongo
import requests
import json

myclient = pymongo.MongoClient('mongodb://localhost:27017/')
mydb = myclient['db']
users= mydb['users']

class TestStringMethods(unittest.TestCase):

    def test_initial_database_check(self):
        self.assertEqual(len(list(users.find())), 2)

    def test_profile_accessibility(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        self.assertEqual(req.status_code, 200)

    def test_not_registered_profile(self):
        req = requests.get('http://127.0.0.1:5000/api/user/fakeperson')
        self.assertEqual(req.status_code, 404)

    def test_empty_endpoint(self):
        req = requests.get('http://127.0.0.1:5000/api/user/')
        self.assertEqual(req.status_code, 404)

    def test_location_retrieved(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        map_status = req.json()['locationmap']['status']
        self.assertEqual(map_status, 'OK')

    def test_location_detail_retrieved(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        map_status = req.json()['locationdetails']['status']
        self.assertEqual(map_status, 'OK')

    def test_posts_retrieved(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        posts = req.json()['posts']
        self.assertIsInstance(posts, list)

    def test_requests_retrieved(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        nofRequests = req.json()['nofRequests']
        self.assertIsInstance(nofRequests, int)

    def test_followers_retrieved(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        nofFollowers = req.json()['nofFollowers']
        self.assertIsInstance(nofFollowers, int)

    def test_followings_retrieved(self):
        req = requests.get('http://127.0.0.1:5000/api/user/atainan')
        nofFollowings = req.json()['nofFollowings']
        self.assertIsInstance(nofFollowings, int)

if __name__ == '__main__':
    unittest.main()
