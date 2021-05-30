from flask import Blueprint, request, jsonify, abort
from ..database import mongo
import requests
import datetime


location_bp = Blueprint('Create Location', __name__)
@location_bp.route('/api/locations/<string:address>', methods=['POST'])
def createLocation(post,username):

    db = mongo.db
    locationDetails=request.form
    address = locationDetails.get('address')

    coordinates =requests.get('https://maps.googleapis.com/maps/api/geocode/json?<string:address>&key=AIzaSyBUmonTQ91F6jFXZij-JgUmF2t8l8XT0Es')

    if coordinates['status'] != "OK":
        return "Bir hata var!"

    place = {
        "address": address,
        "latitude": coordinates['geometry']['location']['lat'],
        "longitude":coordinates['geometry']['location']['lng'],
        "date": datetime.datetime.now(),
    }

    db.places.insert_one(place)
    return jsonify(place)