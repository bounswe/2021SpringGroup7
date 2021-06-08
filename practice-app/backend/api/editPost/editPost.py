from flask import Blueprint, request, abort
from pymongo.message import update
from database import mongo

import datetime 

attributesThatCanBeEdited =   [ "location", 
                                "multimedia", 
                                "story", 
                                "storyDate", 
                                "tags", 
                                "topic", 
                                "userComments"]


editPostDetails_bp = Blueprint('Edit Post Details', __name__)

'''
    Takes username and post id as parameters, edit attributes and their values as jspn request, 
    checks if username belongs to post owner's name. If so, updates the post, returns a success 
    message and HTTP 200 code. If not, returns HTTP 403 error indicating that the user is not 
    authorized to perform this action.
'''
@editPostDetails_bp.route('/api/editPost/<string:username>/<int:postId>', methods=['POST'])
def editPost(username, postId):

    postToBeEdited = getPostInDb(postId)      

    if not postToBeEdited:  
        abort(404, 'Post not found')  

    requestedBy = getUserInDb(username)
    if not requestedBy:
        abort(404, 'User who requested post edit not found')  
    
    if postToBeEdited['owner_username'] != username:
        abort(403, 'This user is not authorized to edit this post')

    editDetails = getRequest()                                             # get parameters

    for attribute in editDetails.keys():
        if attribute not in attributesThatCanBeEdited:
            abort(400,'This attribute\s does not exist or cannot be edited')
        
    updatePostInDb(postToBeEdited, editDetails)

    return 'Successful Edit', 200


def getPostInDb(postId):
    db = mongo.db
    post = db.posts.find_one({'id':postId}, {'_id': False}) 
    return post

def getUserInDb(username):
    db = mongo.db
    user = db.users.find_one({'username': username})
    return user

def updatePostInDb(postToBeEdited, editDetails):
    db = mongo.db
    editDetails['lastEdit'] = datetime.datetime.now()  
    postToBeEdited.update(editDetails)


def getRequest():
    return request.json
