from flask import Blueprint, jsonify
from ..database import mongo
import datetime

likes_bp = Blueprint('Likes of post', __name__)

@likes_bp.route('/api/post/<int:postId>/likes', methods=['GET'])

def getLikes(postId):

    db = mongo.db
    dbresponse = db.likes.find({'postId': postId}, {'_id': False})

    if not dbresponse:
        return 'not found xd'

    data = {
        'items': dbresponse,
        'totalCount': dbresponse.count()
    }

    return jsonify(data)

@likes_bp.route('/api/post/<int:postId>/likes/<string:username>', methods=['POST'])
def like(postId,username):
    db = mongo.db
    dbresponse = db.likes.find({'postId': postId}, {'_id': False})

    if not dbresponse:
        return 'not found xd'

    exist = db.likes.find({ 'postId': postId,'username': username})
    # user already liked this post remove it
    if exist:
        db.likes.delete_one(exist)
        return jsonify({
            'message':'User like undo !',
            'status':200
        })

    likeInstance = {
        "username": username,
        "postId": postId,
        "date": datetime.datetime.now(),
    }
    db.likes.insert_one(likeInstance)

    return jsonify(likeInstance)