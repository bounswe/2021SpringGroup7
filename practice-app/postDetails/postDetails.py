from flask import Blueprint, jsonify, request
#from werkzeug.wrappers import request
from ..database import mongo

import datetime 

postDetails_bp = Blueprint('Post Details', __name__)

# TODO: pass mongo db id of the post
@postDetails_bp.route('/api/postDetail/<int:postId>', methods=['GET', 'POST'])
def postDetails(postId):
    
    db = mongo.db
    dbresponse = db.posts.find({'id': postId},  {'_id': False})

    if not dbresponse:
        return 'Post not found xd'

    # update post
    if request.method == 'POST':
        editDetails = request.json

        query = { 'id' : postId }

        editDetails['lastEdit'] = datetime.datetime.now()
        editValues = { '$set': editDetails }

        db.posts.update_one(query, editValues, upsert=False)

        return jsonify(list(db.posts.find({ 'id' : postId }, {'_id': False})))  # updated value

    
    return jsonify(list(dbresponse))

