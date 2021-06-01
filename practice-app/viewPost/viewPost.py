from flask import Blueprint, jsonify, request, abort
from ..database import mongo

import http.client
import json
import os

viewPostDetails_bp = Blueprint('View Post Details', __name__)

@viewPostDetails_bp.route('/api/viewPost/<int:postId>', methods=['GET'])
def viewPost(postId):
    
    db = mongo.db
    postToBeViewed = db.posts.find_one({'id': postId}, {'_id': False})     # find post with the given id 

    if not postToBeViewed:  
        abort(404)                                           

    similarTags = callSimilarTags(postToBeViewed)
    postToBeViewed['similarTags'] = similarTags     

    return jsonify(postToBeViewed)


'''
    https://rapidapi.com/wordgrabbag/api/similar-words    
    This 3rd party API is used for getting similar words to tags of the story post.                      
'''
def callSimilarTags(postToBeViewed):

    # get api key
    with open(os.path.dirname(__file__) + '/../.apiKey') as f:
        apiKey = f.read()
    
    conn = http.client.HTTPSConnection("similarwords.p.rapidapi.com")
    headers = {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': "similarwords.p.rapidapi.com"
        }

    similarTags = []
    for tag in postToBeViewed['tags']:      
        
        conn.request("GET", "/moar?query=" + tag, headers=headers)
        res = conn.getresponse()
        data = res.read()

        dictData = json.loads(data)                 # convert string data -> dictionary

        similarList = []
        if 'result' in dictData:                  
            similarList = dictData['result']        # similars of a tag

        similarTags.extend(similarList)

    return similarTags

