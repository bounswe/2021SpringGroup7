from flask import Blueprint, jsonify, request, abort
#from werkzeug.wrappers import request
from ..database import mongo
from bson.objectid import ObjectId

import datetime 



editPostDetails_bp = Blueprint('Edit Post Details', __name__)
@editPostDetails_bp.route('/api/postDetail/<string:username>/<string:postId>', methods=['POST'])
def editPost(username, postId):
    
    db = mongo.db

    postToBeEdited = db.posts.find_one({'_id': ObjectId(postId)})     # find post with the given id 
    if not postToBeEdited:  
        abort(500, "Invalid post id")  

    requested_by = db.users.find_one({'username': username})  
    if not requested_by:
        abort(404,'User not found')

    if postToBeEdited['owner'] != username:
        abort(400,'This user is not authorized to edit this post')

    if not request.json:           
        abort(404,'Bad request')

    editDetails = request.json      # get parameters

    attributesThatCanBeEdited = ["location", "multimedia", "story", "storyDate", "tags", "topic", "userComments"]

    for attribute in editDetails.keys():
        if attribute not in attributesThatCanBeEdited:
            abort(400, 'Bad request, this attribute/s cannot be changed or does not exist')
        

    query = { '_id' : ObjectId(postId) }                # find post w.r.t post id
    editDetails['lastEdit'] = datetime.datetime.now()   # add last edit time as now
    editValues = { '$set': editDetails }                # set new values for fields passed as parameter 

    db.posts.update_one(query, editValues, upsert=False)

    updatedPost = db.posts.find_one({'_id' : ObjectId(postId) })    
    updatedPost['_id'] = str(updatedPost['_id'])

    return jsonify(updatedPost) 
