from os import name
from flask import Blueprint, request, jsonify, abort
from database import mongo
import editdistance
import requests
from flasgger import swag_from
import json

relatedLocations = []
location_bp = Blueprint('Create Location', __name__)
@location_bp.route('/api/locations/<string:address>', methods=['POST'])
@swag_from('../../apiDocs/locations/locations.yml')

# '''
#     Takes address , send a request to google geocoding API and get information about this address in json format.
#     Then, send a request with latitude and longitude of address which taking from geocoding API
#     to google nearby search API which gives nearby locations. If address can be found in map , returns a success 
#     message and HTTP 200 code.If not, returns HTTP 404 error indicating that the addressn.
# '''

def locations(address):
  db = mongo.db
  key = "AIzaSyBynOltuL72LjbP3QtIVnFqOOR4KieLRRA"
  try:
    coordinates =requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + key).json()
    latitude = coordinates['results'][0]['geometry']['location']['lat']
    longitude = coordinates['results'][0]['geometry']['location']['lng']

    relatedLocations = requests.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + key + '&location=' + str(latitude) + "," + str(longitude) + '&radius=10000').json()
    related =[]
    for i in relatedLocations['results']:
      related.append(i['name'])
    #relatedLocations için placeId eklenmeli , check edilecek.
    if coordinates['status'] != "OK":
        return "Bir hata var!"
    location = {
        #"locationId": (latitude+longitude),
        "location_name": address,
        "story_ids":[],
        "latitude": latitude,
        "longitude":longitude,
        "relatedLocations":related,
      #  "relatedLocations":"ADANA"
    }
    db.locations.insert_one(location)
    return jsonify({'status': 200,'comment':'Location is created.', 'location_name':address,'latitude':latitude,'longitude':longitude}),200

  except :
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    return jsonify({'status':404,'comment':'create-location-error'} ),404
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    return jsonify({'status':404,'comment':'create-location-error'} ),404
    
>>>>>>> Stashed changes
