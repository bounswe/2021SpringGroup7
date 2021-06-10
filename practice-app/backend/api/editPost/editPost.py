from flask import Blueprint, request, abort
from database import mongo
from flasgger import swag_from
from datetime import datetime


attributesThatCanBeEdited =   [ "location", 
                                "multimedia", 
                                "story", 
                                "storyDate", 
                                "tags", 
                                "topic"
                                ]


editPostDetails_bp = Blueprint('Edit Post Details', __name__)

'''
    Takes username and post id as parameters, edit attributes and their values as jspn request, 
    checks if username belongs to post owner's name. If so, updates the post, returns a success 
    message and HTTP 200 code. If not, returns HTTP 403 error indicating that the user is not 
    authorized to perform this action.
'''
@editPostDetails_bp.route('/api/editPost/<string:ownerUsername>/<int:postId>', methods=['POST'])
@swag_from('../../apidocs/editPost/editPost.yml')
def editPost(ownerUsername, postId):

    postToBeEdited = getPostInDb(postId)      

    if not postToBeEdited:  
        abort(404, 'Post not found')  

    requestedBy = getUserInDb(ownerUsername)
    if not requestedBy:
        abort(404, 'User who requested post edit not found')  
    
    if postToBeEdited['owner_username'] != ownerUsername:
        abort(403, 'This user is not authorized to edit this post')

    editDetails = getRequest()                                             # get parameters

    for attribute in editDetails.keys():
        if attribute not in attributesThatCanBeEdited:
            abort(400, str(attribute) + ' does not exist or cannot be edited')
        
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
    editDetails['lastEdit'] = datetime.now()  

    if 'storyDate' in editDetails.keys():
        start_datetime_str = editDetails['storyDate']['start']             # ex. 'storyDate' : { "start": "18.09.19 01:55:19", "end": "19.09.19 01:55:19" }
        end_datetime_str = editDetails['storyDate']['end']    
        editDetails['storyDate'] = { 'start': datetime.strptime(start_datetime_str, '%d.%m.%y %H:%M:%S'), 'end' : datetime.strptime(end_datetime_str, '%d.%m.%y %H:%M:%S')}

    postToBeEdited.update(editDetails)

def getRequest():
    return request.json
