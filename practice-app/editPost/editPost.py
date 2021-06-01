from flask import Blueprint, jsonify, request, abort
from ..database import mongo

import datetime 

attributesThatCanBeEdited =   [ "location", 
                                "multimedia", 
                                "story", 
                                "storyDate", 
                                "tags", 
                                "topic", 
                                "userComments"]


editPostDetails_bp = Blueprint('Edit Post Details', __name__)
@editPostDetails_bp.route('/api/editPost/<string:username>/<string:postId>', methods=['POST'])
def editPost(username, postId):
    
    db = mongo.db

    postToBeEdited = db.posts.find_one({'id':postId}, {'_id': False})     # find post with the given id 
    requestedBy = db.users.find_one({'username': username})


    if not postToBeEdited or not requestedBy:  
        abort(404)  

    if postToBeEdited['owner_username'] != username:
        abort(403)

    editDetails = request.json                                             # get parameters

    for attribute in editDetails.keys():
        if attribute not in attributesThatCanBeEdited:
            abort(400)
        
    editDetails['lastEdit'] = datetime.datetime.now()   # add last edit time as now
    postToBeEdited.update(editDetails)                  # set new values for fields passed as parameter  

    return jsonify(postToBeEdited) 
