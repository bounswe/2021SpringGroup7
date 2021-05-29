from flask import Blueprint, jsonify, request, abort
#from werkzeug.wrappers import request
from ..database import mongo
from bson.objectid import ObjectId

import datetime 
import http.client
import json
import os

postDetails_bp = Blueprint('Post Details', __name__)

@postDetails_bp.route('/api/postDetail/<string:postId>', methods=['GET', 'POST'])
def postDetails(postId):
    
    db = mongo.db
    postToBeViewed = db.posts.find_one({'_id': ObjectId(postId)})     # find post with the given id 

    if not postToBeViewed:  
        abort(404, "Post not found")                                           

    # view post details
    if request.method == 'GET': 

        # get api key
        #data = json.load(open('apiKey.json'))   # ???
        #apiKey = data['API_KEY']
        
        '''
            https://rapidapi.com/dpventures/api/wordsapi     
            Here, this api is used for getting the synonyms of tags.                      
        '''
        conn = http.client.HTTPSConnection("wordsapiv1.p.rapidapi.com")
        headers = {
            'x-rapidapi-key': "",   #apiKey
            'x-rapidapi-host': "wordsapiv1.p.rapidapi.com"
            }

        similarTags = []
        for tag in postToBeViewed['tags']:      # get list of synonyms from 3rd party api for each tag of the post
            
            # make a call for synonyms list of a word 
            conn.request('GET', '/words/' + tag + '/synonyms', headers=headers)
            res = conn.getresponse()
            data = res.read()

            dictData = json.loads(data)                 # convert string data -> dictionary
            print('dictdata ' + str(dictData))
            synonymList = []
            if 'synonyms' in dictData:                  # list of synonyms for a tag
                synonymList = dictData['synonyms']

            similarTags.extend(synonymList)
        
        postToBeViewed['similarTags'] = similarTags     # add similar tags to result
        postToBeViewed['_id'] = str(postToBeViewed['_id'])

        return jsonify(postToBeViewed)


    # update post details (post request)
    else:

        if not request.json:            # no parameter
            abort(400,'Bad request, send parameters in json')

        editDetails = request.json      # get parameters

        if 'postDate' in editDetails:
            abort(400, 'Bad request, postDate cannot be changed')

        query = { '_id' : ObjectId(postId) }                # find post w.r.t post id
        editDetails['lastEdit'] = datetime.datetime.now()   # add last edit time as now
        editValues = { '$set': editDetails }                # set new values for fields passed as parameter 

        db.posts.update_one(query, editValues, upsert=False)

        updatedPost = db.posts.find_one({'_id' : ObjectId(postId) })    
        updatedPost['_id'] = str(updatedPost['_id'])

        return jsonify(updatedPost) 
