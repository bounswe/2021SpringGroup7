from flask import Blueprint, jsonify, request, abort
#from werkzeug.wrappers import request
from ...database import mongo
from bson.objectid import ObjectId

import http.client
import json
import os


viewPostDetails_bp = Blueprint('View Post Details', __name__)

@viewPostDetails_bp.route('/api/postDetail/<string:postId>', methods=['GET'])
def viewPost(postId):
    
    db = mongo.db
    postToBeViewed = db.posts.find_one({'id': postId}, {'_id': False})     # find post with the given id 

    if not postToBeViewed:  
        abort(404, "Invalid post id")                                           

    '''
        https://rapidapi.com/wordgrabbag/api/similar-words    
        This api is used for getting the words similar to tags.                      
    '''
    conn = http.client.HTTPSConnection("similarwords.p.rapidapi.com")
    
    # get api key
    with open(os.path.dirname(__file__) + '/../.apiKey') as f:
        apiKey = f.read()
    
    headers = {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': "similarwords.p.rapidapi.com"
        }

    similarTags = []
    for tag in postToBeViewed['tags']:      # get list of similar words from 3rd party api for each tag of the post
        
        # make a call to get list of similars of a word
        conn.request("GET", "/moar?query=" + tag, headers=headers)
        res = conn.getresponse()
        data = res.read()

        dictData = json.loads(data)                 # convert string data -> dictionary

        similarList = []
        if 'result' in dictData:                  
            similarList = dictData['result']        # similar list for a tag

        similarTags.extend(similarList)
    
    postToBeViewed['similarTags'] = similarTags     # add similar tags to result

    return jsonify(postToBeViewed)
