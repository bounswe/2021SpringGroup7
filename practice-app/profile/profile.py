from flask import Blueprint, request, jsonify, abort
from ..database import mongo
import requests
import os.path

profile_bp = Blueprint('User Profiles', __name__)

@profile_bp.route('/user/<string:username>', methods=['GET'])
def getProfile(username):
    
    db = mongo.db
    curUser = db.users.find_one({'username': username}, {'_id': False})

    if not curUser:
        abort(404, "User not found")

    nofReq = len(curUser['followRequests'])
    nofFollowers = len(curUser['followers'])
    nofFollowings = len(curUser['followings']) 
    
    # place your Google Cloud API key to a '.key' file in parent directory
    with open(os.path.dirname(__file__) + '/../.key') as f:
        key = '&' + f.read()

    searchBase = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' 
    placeSearch = requests.get(searchBase + curUser['location'] + key)

    detailsBase = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='
    placeId = placeSearch.json()['results'][0]['place_id']
    details = requests.get(detailsBase + placeId + key)

    curUser.update({'nofRequests':nofReq, 'nofFollowers':nofFollowers,
        'nofFollowings':nofFollowings, 'locationmap':placeSearch.json(),
        'locationdetails':details.json()})

    return jsonify(curUser)

@profile_bp.route('/user/<string:username>/update', methods=['POST'])
def updateProfile(username):

    db = mongo.db
    
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    email = request.form['email']
    location = request.form['location']
    birthday = request.form['birthday']
    isVisible = request.form['isVisible']

    curUser = db.users.find_one({'username': username}, {'_id': False})

    if not curUser:
        abort(404, "User not found")

    first_name = curUser['first_name'] if (first_name == '') else first_name
    last_name = curUser['last_name'] if (last_name == '') else last_name
    email = curUser['email'] if (email == '') else email
    location = curUser['location'] if (location == '') else location
    birthday = curUser['birthday'] if (birthday == '') else birthday
    isVisible = curUser['isVisible'] if (isVisible == '') else isVisible

    nofReq = len(curUser['followRequests'])
    nofFollowers = len(curUser['followers'])
    nofFollowings = len(curUser['followings'])
    
    # place your Google Cloud API key to a '.key' file in parent directory
    with open(os.path.dirname(__file__) + '/../.key') as f:
        key = '&' + f.read()

    searchBase = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' 
    placeSearch = requests.get(searchBase + location + key)

    detailsBase = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='
    placeId = placeSearch.json()['results'][0]['place_id']
    details = requests.get(detailsBase + placeId + key)

    updated = {'$set': {'first_name':first_name, 'last_name':last_name, 'email':email,
        'location':location, 'birthday':birthday, 'isVisible':isVisible}}

    db.users.update_one(curUser, updated)
    curUser = db.users.find_one({'username': username}, {'_id': False})

    curUser.update({'nofRequests':nofReq, 'nofFollowers':nofFollowers,
        'nofFollowings':nofFollowings, 'locationmap':placeSearch.json(),
        'locationdetails':details.json()})

    return jsonify(curUser)
