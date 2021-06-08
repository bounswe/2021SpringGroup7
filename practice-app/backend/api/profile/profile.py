from flask import Blueprint, request, jsonify, abort
import requests
from database import mongo
from flasgger import swag_from

'''
    Blueprint for the profile page routes in the application
'''
profile_bp = Blueprint('User Profiles', __name__)

'''
    Takes an username as input and returns the necessary information about the user to show in the
    frontend. User information is stored in the database, but more information is also added to the
    returned json. This information contains the number of follow requests, followers, followings;
    coordinates, name and address of the user's location, all fields of the posts of the user.
'''
@profile_bp.route('/api/user/<string:username>', methods=['GET'])
@swag_from('../../apidocs/viewProfile/viewProfile.yml')
def getProfile(username):
    
    curUser = getUserFromDB(username)

    if not curUser:
        abort(404, "User not found")

    nofReq, nofFollowers, nofFollowings = getCountsOfUser(curUser)
    
    posts = getPostsOfUser(curUser)

    coordinates, locationName, fullAddress, formatAddress = getLocationInfo(curUser['location'])

    curUser.update({'nofRequests':nofReq, 'nofFollowers':nofFollowers,
        'nofFollowings':nofFollowings, 'posts':posts, 'coordinates':coordinates,
        'locationName':locationName, 'fullAddress':fullAddress, 'formatAddress':formatAddress})

    return jsonify(curUser)


'''
    Takes an username as input and user fields from the post request. Updates the user information in
    the database and returns 'Success' with the HTTP Status Code 200 to confirm the update.
'''
@profile_bp.route('/api/user/<string:username>/update', methods=['POST'])
@swag_from('../../apidocs/updateProfile/updateProfile.yml')
def updateProfile(username):

    post = getRequest()
    
    first_name = post.get('first_name')
    last_name = post.get('last_name')
    email = post.get('email')
    location = post.get('location')
    birthday = post.get('birthday')
    isVisible = post.get('isVisible')

    curUser = getUserFromDB(username)

    if not curUser:
        abort(404, "User not found")

    first_name = curUser['first_name'] if (first_name == '') else first_name
    last_name = curUser['last_name'] if (last_name == '') else last_name
    email = curUser['email'] if (email == '') else email
    location = curUser['location'] if (location == '') else location
    birthday = curUser['birthday'] if (birthday == '') else birthday
    isVisible = curUser['isVisible'] if (isVisible == '') else isVisible

    updateUserInDB(curUser, first_name, last_name, email, location, birthday, isVisible) 

    return 'Success', 200


'''
    Takes an username as input and returns the user information having this username from the
    database.
'''
def getUserFromDB(username):
    db = mongo.db
    return db.users.find_one({'username': username}, {'_id': False})


'''
    Takes an user as input returns their number of follow requests, followers and followings.
'''
def getCountsOfUser(curUser):
    return len(curUser['followRequests']), len(curUser['followers']), len(curUser['followings'])


'''
    Takes an user as input and returns their posts as list from the database.
'''
def getPostsOfUser(curUser):
    db = mongo.db
    return [db.posts.find_one({'id':postId}, {'_id':False}) for postId in curUser['postIds']]


'''
    Takes a location as string as input and returns information about it using the Google Maps API.
    This information includes the coordinates, the full name of the location, the full address and the
    formatted address of the location.
'''
def getLocationInfo(location):
    key = '&key=AIzaSyAhLt4H3iJLpmC0z_ospp1eMuW1efmqJU0'

    searchBase = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' 
    placeSearch = requests.get(searchBase + location + key)

    if placeSearch.json()['status'] != 'OK' :
        return '','','',''

    coordinates = placeSearch.json()['results'][0]['geometry']['location']

    detailsBase = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='
    placeId = placeSearch.json()['results'][0]['place_id']
    details = requests.get(detailsBase + placeId + key)

    if details.json()['status'] != 'OK' :
        return '','','',''

    locationName = details.json()['result']['address_components'][0]['long_name']
    fullAddress = details.json()['result']['adr_address']
    formatAddress = details.json()['result']['formatted_address']

    return coordinates, locationName, fullAddress, formatAddress


def getRequest():
    return request.form


'''
    Updates the fields of the user in the database.
'''
def updateUserInDB(curUser, first_name, last_name, email, location, birthday, isVisible):
    db = mongo.db
    updated = {'$set': {'first_name':first_name, 'last_name':last_name, 'email':email,
        'location':location, 'birthday':birthday, 'isVisible':isVisible}}

    db.users.update_one(curUser, updated)
