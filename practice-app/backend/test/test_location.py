import unittest
import pymongo
import requests
import json

class TestLocationMethods(unittest.TestCase):

    def test_empty_endpoint(self):
        req = requests.post("http://127.0.0.1:5000/api/locations/")
        self.assertEqual(req.status_code, 404)

    def test_first_case(self):
        req = requests.post("http://127.0.0.1:5000/api/locations/adana").json()
        self.assertEqual(req.status_code, 200)
        self.assertEqual(req["latitude"], "36.9914194")
        self.assertEqual(req["longitude"], "35.3308285")
        self.assertEqual(len(req["relatedLocations"]), 20)
   
    def test_second_case(self):
        req = requests.post("http://127.0.0.1:5000/api/locations/hostapark hotel").json()
        self.assertEqual(req.status_code, 200)
        self.assertEqual(req["latitude"], "36.8041565")
        self.assertEqual(req["longitude"], "34.6244029")
        self.assertEqual(req["relatedLocations"][0], "Mersin")

    def test_third_harder_case(self):
        req = requests.post("http://127.0.0.1:5000/api/locations/uçaksavar sitesi").json()
        self.assertEqual(req.status_code, 200)
        self.assertEqual(req["latitude"], "41.0875268")
        self.assertEqual(req["longitude"], "29.0371535")
        self.assertEqual(req["relatedLocations"][0], "İstanbul")
        self.assertEqual(req["relatedLocations"][1], "Le Méridien Istanbul Etiler")
        self.assertEqual(req["relatedLocations"][2], "Cheya Residence Rumelihisari")
        self.assertEqual(len(req["relatedLocations"]), 20)

    def test_number(self):
        req = requests.post("http://127.0.0.1:5000/api/locations/1234413").json()
        self.assertEqual(req.status_code, 404)
        self.assertEqual(req['comment'],'create-location-error')


if __name__ == '__main__':
    unittest.main()
