import unittest
import pymongo
import requests
import json

myclient = pymongo.MongoClient('mongodb://localhost:27017/')
mydb = myclient['db']
users = mydb['users']

class TestStringMethods(unittest.TestCase):

    def test_initial_database_check(self):
        self.assertEqual(len(list(users.find())), 2)

    def test_request(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update')
        self.assertEqual(req.status_code, 500)

    def test_real_profile(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        self.assertEqual(req.status_code, 200)

    def test_profile_info(self):
        user = users.find_one({'username':'atainan'}, {'_id':False})
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        self.assertEqual(user['username'], req.json()['username'])
        self.assertEqual(user['first_name'], req.json()['first_name'])
        self.assertEqual(user['last_name'], req.json()['last_name'])
        self.assertEqual(user['email'], req.json()['email'])
        self.assertEqual(user['location'], req.json()['location'])
        self.assertEqual(user['birthday'], req.json()['birthday'])
        self.assertEqual(user['isVisible'], req.json()['isVisible'])

    def test_location_retrieved(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        map_status = req.json()['locationmap']['status']
        self.assertEqual(map_status, 'OK')

    def test_location_detail_retrieved(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        map_status = req.json()['locationdetails']['status']
        self.assertEqual(map_status, 'OK')

    def test_posts_retrieved(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        posts = req.json()['posts']
        self.assertIsInstance(posts, list)

    def test_requests_retrieved(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        nofRequests = req.json()['nofRequests']
        self.assertIsInstance(nofRequests, int)

    def test_followers_retrieved(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        nofFollowers = req.json()['nofFollowers']
        self.assertIsInstance(nofFollowers, int)

    def test_followings_retrieved(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        nofFollowings = req.json()['nofFollowings']
        self.assertIsInstance(nofFollowings, int)

    def test_first_name_update(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'testname',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        first_name = req.json()['first_name']
        self.assertEqual(first_name, 'testname')

    def test_last_name_update(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'testname', 'email':'', 'location':'', 'birthday':'', 'isVisible':''})
        last_name = req.json()['last_name']
        self.assertEqual(last_name, 'testname')

    def test_email_update(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'email@gmail.com', 'location':'', 'birthday':'', 'isVisible':''})
        email = req.json()['email']
        self.assertEqual(email, 'email@gmail.com')

    def test_location_update(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'bogazici', 'birthday':'', 'isVisible':''})
        location = req.json()['location']
        self.assertEqual(location, 'bogazici')

    def test_birthday_update(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'15.08.1998', 'isVisible':''})
        birthday = req.json()['birthday']
        self.assertEqual(birthday, '15.08.1998')

    def test_visibility_update(self):
        req = requests.post('http://127.0.0.1:5000/api/user/atainan/update', {'first_name':'',
            'last_name':'', 'email':'', 'location':'', 'birthday':'', 'isVisible':True})
        visibility = req.json()['isVisible']
        self.assertTrue(visibility)


if __name__ == '__main__':
    unittest.main()
