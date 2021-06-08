from flask import Blueprint, jsonify, abort
from database import mongo

import http.client
import json
import os


viewPostDetails_bp = Blueprint('View Post Details', __name__)

'''
    Takes post id as parameter, retrieves and returns the 
    related post's information from database.
    Also, calls an external api to find similar words to 
    the post's tags. Returns this with other information. 
'''
@viewPostDetails_bp.route('/api/viewPost/<int:postId>', methods=['GET'])
def viewPost(postId):

    postToBeViewed = getPostInDb(postId)   

    if not postToBeViewed:  
        abort(404, 'Post not found')                                           

    similarTags = callSimilarTags(postToBeViewed)[0]
    postToBeViewed['similarTags'] = similarTags     

    return jsonify(postToBeViewed)


'''
    https://rapidapi.com/wordgrabbag/api/similar-words    
    This 3rd party API is used for getting similar words to tags of the story post.                      
'''
def callSimilarTags(postToBeViewed):

    # get api key
    with open(os.path.dirname(__file__) + '/../../.apiKey') as f:
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

    return similarTags, 200


def getPostInDb(postId):
    db = mongo.db
    post = db.posts.find_one({'id':postId}, {'_id': False}) 
    return post
