from flask import Blueprint, jsonify, request, abort
#from werkzeug.wrappers import request
from database import mongo

import datetime 

editPostDetails_bp = Blueprint('Edit Post Details', __name__)
@editPostDetails_bp.route('/api/postDetail/<string:username>/<string:postId>', methods=['POST'])
def editPost(username, postId):
    
    db = mongo.db

    postToBeEdited = db.posts.find_one({'id':postId}, {'_id': False})     # find post with the given id 
    if not postToBeEdited:  
        abort(404, "Invalid post id")  

    requestedBy = db.users.find_one({'username': username})  
    if not requestedBy:
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
        

    query = { 'id' : postId }                # find post w.r.t post id
    editDetails['lastEdit'] = datetime.datetime.now()   # add last edit time as now
    editValues = { '$set': editDetails }                # set new values for fields passed as parameter 

    db.posts.update_one(query, editValues, upsert=False)

    updatedPost = db.posts.find_one({'id' : postId }, {'_id': False})    

    return jsonify(updatedPost) 
