from flask import Blueprint, jsonify
from ..database import mongo

postDetails_bp = Blueprint('Post Details', __name__)


@postDetails_bp.route('/postDetail/<int:postId>', methods=['GET'])
def getPostDetails(postId):
    
    db = mongo.db
    dbresponse = db.posts.find({'id': postId}, {'_id': False})

    if not dbresponse:
        return 'Post not found xd'

    return jsonify(list(dbresponse))
