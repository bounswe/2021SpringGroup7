import unittest
import pymongo
import requests
import json

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["db"]
mycol = mydb["locations"]

class TestStringMethods(unittest.TestCase):

    def test_initial_database_check(self):
        self.assertEqual(len(list(mycol.find())), 15)

    def test_empty_endpoint(self):
        req = requests.get("http://127.0.0.1:5000/api/search/")
        self.assertEqual(req.status_code, 404)

    def test_first_case(self):
        req = requests.get("http://127.0.0.1:5000/api/search/boğaziçi üniversitesi")
        self.assertEqual(req.status_code, 200)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "      boğaziçi                        üniversitesi           ")
        self.assertEqual(len(req_json["recommendations"]), 5)
        self.assertEqual(req_json["comment"], "Successful Search")

    def test_first_harder_case(self):
        req = requests.get("http://127.0.0.1:5000/api/search/Bogazıçi UnıverSıtesi")
        self.assertEqual(req.status_code, 200)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "      boğaziçi                        üniversitesi           ")
        self.assertEqual(len(req_json["recommendations"]), 5)
        self.assertEqual(req_json["comment"], "Successful Search")

    
    def test_second_case(self):
        req = requests.get("http://127.0.0.1:5000/api/search/abc universitesi")
        self.assertEqual(req.status_code, 200)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "")
        self.assertEqual(len(req_json["recommendations"]), 5)
        self.assertEqual(req_json["comment"], "Successful Search")
        self.assertEqual(req_json["recommendations"][0], "koç üniversitesi")

    def test_second_harder_case(self):
        req = requests.get("http://127.0.0.1:5000/api/search/aBc          universitesı     ")
        self.assertEqual(req.status_code, 200)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "")
        self.assertEqual(len(req_json["recommendations"]), 5)
        self.assertEqual(req_json["comment"], "Successful Search")
        self.assertEqual(req_json["recommendations"][0], "koç üniversitesi")

    def test_third_case(self):
        req = requests.get("http://127.0.0.1:5000/api/search/london")
        self.assertEqual(req.status_code, 200)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "")
        self.assertEqual(len(req_json["recommendations"]), 5)
        self.assertEqual(req_json["comment"], "Successful Search")
        self.assertEqual(req_json["recommendations"][0], "Londra")
    
    def test_fourth_case(self):
        req = requests.get("http://127.0.0.1:5000/api/search/Taksım       meydanı   ")
        self.assertEqual(req.status_code, 200)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "          taksim meydanı")
        self.assertEqual(len(req_json["recommendations"]), 5)
        self.assertEqual(req_json["comment"], "Successful Search")
        self.assertEqual(req_json["recommendations"][0], "          taksim meydanı")

    def test_number(self):
        req = requests.get("http://127.0.0.1:5000/api/search/1234413")
        self.assertEqual(req.status_code, 400)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "")
        self.assertEqual(len(req_json["recommendations"]), 0)
        self.assertEqual(req_json["comment"], "Wrong Input")

    def test_french(self):
        req = requests.get("http://127.0.0.1:5000/api/search/bonjour")
        self.assertEqual(req.status_code, 400)
        req_json = json.loads(req.text)
        self.assertEqual(req_json["exact_match"], "")
        self.assertEqual(len(req_json["recommendations"]), 0)
        self.assertEqual(req_json["comment"], "Wrong Input Language")



if __name__ == '__main__':
    unittest.main()
