import unittest
import requests
import json



class TestStringMethods(unittest.TestCase):
    
    def test_adding_user_api(self):
        req = requests.post("http://127.0.0.1:5000/api/report/195")
        self.assertEqual(req.status_code, 201)
        self.assertEqual(json.loads(req.text)['userId'], 195)

    def test_adding_multiple_user_api(self):
        req = requests.post("http://127.0.0.1:5000/api/report/195")
        self.assertEqual(req.status_code, 201)
        self.assertEqual(json.loads(req.text)['userId'], 195)

        req = requests.post("http://127.0.0.1:5000/api/report/456")
        self.assertEqual(req.status_code, 201)
        self.assertEqual(json.loads(req.text)['userId'], 456)

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
