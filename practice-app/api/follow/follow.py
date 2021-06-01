from flask import Blueprint, jsonify, abort
from ...database import mongo

follow_bp = Blueprint('Follow Actions and Viewing Followers/Following', __name__)

@follow_bp.route("/user/<string:usernameOfFollower>/follow/<string:usernameToFollow>", methods=['POST'])
def followUser(usernameOfFollower, usernameToFollow):

    userThatFollows = getUserFromDb(usernameOfFollower)
    userToFollow = getUserFromDb(usernameToFollow)

    if not userToFollow or not userThatFollows:
        abort(404, "User not found")

    if (usernameOfFollower in userToFollow['followers'] and usernameToFollow in userThatFollows['followings']) or usernameOfFollower in userToFollow['followRequests']:
        return "Already followed", 200

    if userToFollow['isVisible'] == "True":
        addToUserArrayInDb(userThatFollows['_id'], userToFollow, 'followings')
        addToUserArrayInDb(userToFollow['_id'], usernameOfFollower, 'followers')
        return "Success", 200
    else:
        addToUserArrayInDb(userToFollow['_id'], usernameOfFollower, 'followRequests')
        return "Success", 200


@follow_bp.route("/user/<string:username>/followers", methods=['GET'])
def getFollowers(username):
    user = getUserFromDb(username)

    if not user:
        abort(404, "User not found")

    return jsonify(user['followers'])


@follow_bp.route("/user/<string:username>/followings", methods=['GET'])
def getFollowings(username):
    user = getUserFromDb(username)

    if not user:
        abort(404, "User not found")

    return jsonify(user['followings'])


@follow_bp.route("/user/<string:username>/followRequests", methods=['GET'])
def getFollowRequest(username):
    user = getUserFromDb(username)

    if not user:
        abort(404, "User not found")

    return jsonify(user['followRequests'])


def getUserFromDb(username):
    db = mongo.db
    return db.users.find_one({'username': username})


def addToUserArrayInDb(userId, stringToAdd, fieldName):
    db = mongo.db
    db.users.update_one({'_id': userId}, {'$addToSet': {fieldName: stringToAdd}})
