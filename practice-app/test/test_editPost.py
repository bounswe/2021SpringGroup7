import unittest
import pymongo
import requests
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
posts = mydb["posts"]

class TestPostDetail(unittest.TestCase):

    def test_empty_endpoint(self):
        response = requests.post("http://127.0.0.1:5000/api/editPost/")
        self.assertEqual(response.status_code, 404)

    def test_post_not_found(self):
        response = requests.post("http://127.0.0.1:5000/api/editPost/atainan/-1", {})
        self.assertEqual(response.status_code, 404)

    def test_requested_by_not_found(self):
        response = requests.post("http://127.0.0.1:5000/api/editPost/non-existing-user/1", {})
        self.assertEqual(response.status_code, 404)

    def test_user_not_authorized(self):
        response = requests.post("http://127.0.0.1:5000/api/editPost/atainan/2", {})
        self.assertEqual(response.status_code, 403)

    def test_bad_edit_request(self):
        response = requests.post("http://127.0.0.1:5000/api/editPost/ryan/2", json={"postDate" : "03.03.21"})
        self.assertEqual(response.status_code, 400)
    
    def test_edit_post(self):
        editVal = {'story':'I changed my story for some reason...', 'topic' : 'It is changable'}
        response = requests.post("http://127.0.0.1:5000/api/editPost/ryan/2", json=editVal)
        response_json = json.loads(response.text)
        for key in editVal.keys():
            self.assertEqual(response_json[key], editVal[key])
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()