import unittest
import pymongo
import requests
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
mycol = mydb["reports"]

class TestStringMethods(unittest.TestCase):

    def test_initial_database_check(self):
        self.assertEqual(len(list(mycol.find())), 1)

    def test_adding_user(self):
        mycol.insert_one({'userId': 5 })
        self.assertEqual(len(list(mycol.find())), 2)
        mycol.delete_one({'userId': 5 })

    def test_adding_user_id(self):
        mycol.insert_one({'userId': 5 })
        self.assertEqual(len(list(mycol.find({'userId': 5 }))), 1)
        mycol.delete_one({'userId': 5 })
    
    def test_adding_user_api(self):
        req = requests.post("http://127.0.0.1:5000/api/report/195")
        self.assertEqual(req.status_code, 201)
        self.assertEqual(json.loads(req.text)['userId'], 195)
        mycol.delete_one({'userId': 195 })

    def test_adding_multiple_user_api(self):
        req = requests.post("http://127.0.0.1:5000/api/report/195")
        self.assertEqual(req.status_code, 201)
        self.assertEqual(json.loads(req.text)['userId'], 195)

        req = requests.post("http://127.0.0.1:5000/api/report/456")
        self.assertEqual(req.status_code, 201)
        self.assertEqual(json.loads(req.text)['userId'], 456)

        mycol.delete_one({'userId': 195 })
        mycol.delete_one({'userId': 456 })

    def test_empty_endpoint(self):
        req = requests.post("http://127.0.0.1:5000/api/report/")
        self.assertEqual(req.status_code, 404)

    def test_string_endpoint(self):
        req = requests.post("http://127.0.0.1:5000/api/report/abcdef")
        self.assertEqual(req.status_code, 404)

    def test_float_endpoint(self):
        req = requests.post("http://127.0.0.1:5000/api/report/3.156")
        self.assertEqual(req.status_code, 404)




if __name__ == '__main__':
    unittest.main()
