from flask import Blueprint, request, jsonify, abort
from ...database import mongo
import requests
import datetime

relatedLocations = []
location_bp = Blueprint('Create Location', __name__)
@location_bp.route('/api/locations/create', methods=['POST'])

def createLocation():


    db = mongo.db
    locationDetails=request.get_json()
    address = locationDetails['address']
    key = "AIzaSyBUmonTQ91F6jFXZij-JgUmF2t8l8XT0Es"
    try:
        coordinates =requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + key)
        latitude = coordinates['geometry']['location']['lat']
        longitude = coordinates['geometry']['location']['lng']

        relatedLocations = requests.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + key + '&location=' + latitude + "," + longitude + '&radius=10000')
        # db.locations.find_one({})
        # postToBeEdited = db.posts.find_one({'_id': ObjectId(postId)})

        if coordinates['status'] != "OK":
            return "Bir hata var!"

        location = {
            "locationId": (latitude+longitude),
            "address": address,
            "latitude": latitude,
            "longitude":longitude,
            "date": datetime.datetime.now(),
            "relatedLocations":relatedLocations
        }

        db.locations.insert_one(location)
        return(jsonify({'status': 200, 'location':location}))
    except :
        abort(jsonify(404,'create-location-error' ))
    
