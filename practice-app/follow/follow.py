from flask import Blueprint, jsonify, abort
from ..database import mongo

follow_bp = Blueprint('Follow Actions and Viewing Followers/Following', __name__)

@follow_bp.route("/user/<string:usernameOfFollower>/follow/<string:usernameToFollow>", methods=['POST'])
def followUser(usernameOfFollower, usernameToFollow):

    db = mongo.db

    userThatFollows = db.users.find_one({'username': usernameOfFollower})
    userToFollow = db.users.find_one({'username': usernameToFollow})

    if not userToFollow and not userThatFollows:
        abort(404, "User not found")

    if usernameOfFollower in userToFollow['followers'] or usernameOfFollower in userToFollow['followRequests']:
        return "Already followed", 200

    if userToFollow['isVisible'] == "True":
        db.users.update_one({'_id': userThatFollows['_id']}, {'$addToSet': {'followings': usernameToFollow}})
        db.users.update_one({'_id': userToFollow['_id']}, {'$addToSet': {'followers': usernameOfFollower}})
        return "Success", 200
    else:
        db.users.update_one({'_id': userToFollow['_id']}, {'$addToSet': {'followRequests': usernameOfFollower}})
        return "Success", 200

@follow_bp.route("/user/<string:username>/followers", methods=['GET'])
def getFollowers(username):
    db = mongo.db
    user = db.users.find_one({'username': username})

    if not user:
        abort(404, "User not found")

    return jsonify(user['followers'])

@follow_bp.route("/user/<string:username>/followings", methods=['GET'])
def getFollowings(username):
    db = mongo.db
    user = db.users.find_one({'username': username})

    if not user:
        abort(404, "User not found")

    return jsonify(user['followings'])

