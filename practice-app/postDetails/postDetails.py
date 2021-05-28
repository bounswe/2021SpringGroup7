from flask import Blueprint, jsonify, request, abort
#from werkzeug.wrappers import request
from ..database import mongo

import datetime 
import http.client
import json

postDetails_bp = Blueprint('Post Details', __name__)

# TODO: pass mongo db id of the post
@postDetails_bp.route('/api/postDetail/<int:postId>', methods=['GET', 'POST'])
def postDetails(postId):
    
    db = mongo.db
    dbresponse = db.posts.find({'id': postId},  {'_id': False})     # find post with the given id 

    if not dbresponse:                                              # 
        return 'Post not found xd'

    # view post details
    if request.method == 'GET': 
        
        queryResult = list(dbresponse)   

        '''
            https://rapidapi.com/dpventures/api/wordsapi                           
        '''
        conn = http.client.HTTPSConnection("wordsapiv1.p.rapidapi.com")
        headers = {
            'x-rapidapi-key': "eedd55b42fmshad927cbdcb4feafp1fe3fejsnfb92b2735386",
            'x-rapidapi-host': "wordsapiv1.p.rapidapi.com"
            }

        similarTags = []
        for tag in queryResult[0]['tags']:      # get list of synonyms from 3rd party api for each tag of the post
            
            conn.request('GET', '/words/' + tag + '/synonyms', headers=headers)
            res = conn.getresponse()
            data = res.read()

            dictData = json.loads(data)         # convert string data -> dictionary
            tagList = dictData['synonyms']      # list of synonyms for a tag

            similarTags.extend(tagList)
        
        queryResult[0]['similarTags'] = similarTags     # add similar tags to result
        
        return jsonify(queryResult)

    # update post details
    else:

        if not request.json:            # no parameter sent with body in json
            abort(400)

        editDetails = request.json      # get json body

        query = { 'id' : postId }       # find post w.r.t post id

        editDetails['lastEdit'] = datetime.datetime.now()   # add last edit time as now
        editValues = { '$set': editDetails }

        db.posts.update_one(query, editValues, upsert=False)

        return jsonify(list(db.posts.find({ 'id' : postId }, {'_id': False})))  # updated value

