import datetime
from os import error
from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify, abort
from flask_pymongo import ASCENDING
from pymongo.bulk import _WRITE_CONCERN_ERROR
from pymongo.son_manipulator import ObjectIdInjector
from ..database import mongo
from flask_cors import CORS
from ..storyTime.storyTime import createStoryTime_method
from ..multiMedia.multiMedia import createMedia_method


story_bp = Blueprint('Story', __name__)
CORS(story_bp)
cors = CORS(story_bp, resources={r"/*": {"origins": "*"}})


@story_bp.route('/api/story/create-story',  methods=['POST'])
def createStory():
    data = request.get_json()
    db = mongo.db
    
    try:
        if('storyTimeId' not in data and data['date']):
            print("here")
            id = createStoryTime_method(data['date'])
            data['storyTimeId'] = id
        if('mediaId' not in data and data['media']):
            print("here")
            id = createMedia_method(data['media'])
            data['mediaId'] = id
        if('locationIds' not in data and data['locations']):
            # call-location
            print(' ')
        dbresponse = db.stories.insert_one({
            'text': data['text'],
            'title': data['title'],
            'tags': data['tags'],
            #    'likes':[ObjectId(person) for person in data['likes']],
            #    'comments':[ObjectId(person) for person in data['comments']],
            'mediaId': ObjectId(data['mediaId']),
            'owner': ObjectId(data['owner']),
            'locations':[ObjectId(location) for location in data['locationIds']],
            'date': ObjectId(data['storyTimeId']),
            'postTime': datetime.datetime.utcnow(),
            'numberOfLikes':0,
            'numberOfComments':0,
            
        })
        return(jsonify({'status': 200,
         'id': str(dbresponse.inserted_id)}))
    except :

        abort(jsonify(404,'create-story-error' ))
    
   


# with story_bp.test_create as test1:
#     response=test1.post('/story/create-story', json={

#         "text": "galatada bir gün",
#         "title": "galata",
#         "tags": [
#             "asdasd",
#             "asdasd",
#             "asdas"
#         ],
#         "owner": "60afb2511f252a45c797d5e8",
#         "likes": [
#             "60afb2511f252a45c797d5e8",
#             "60afb2511f252a45c797d5e8"
#         ],
#         "comments": [
#             "60afb2511f252a45c797d5e8",
#             "60afb2511f252a45c797d5e8",
#             "60afb2511f252a45c797d5e8"
#         ],
#         "date": {
#             "dateOne": "20.12.2020",
#             "dateTwo": "27.12.2020",
#             "dateType": "interval"
#         },
#         "mediaId": "60b14f2a782468b38e4c33c3"

#     })
#     assert response
