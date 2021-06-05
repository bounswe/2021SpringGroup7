import datetime
from os import error
from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify, abort
from flask_pymongo import ASCENDING
from pymongo.bulk import _WRITE_CONCERN_ERROR
from database import mongo

# from flask_cors import CORS


story_bp = Blueprint('Story', __name__)
# CORS(story_bp)
# cors = CORS(story_bp, resources={r"/*": {"origins": "*"}})


@story_bp.route('/api/story/create',  methods=['POST'])
def createStory(): 
    data = request.get_json()
    db = mongo.db
    print(data)
    
    if ('story' not in data):
        abort(400, 'create-story error: empty story')
    if ('topic' not in data):
        abort(400, 'create-story error: empty topic')
    if ('tags' not in data):
        abort(400, 'create-story error: empty tags')
    if ('multimedia' not in data):
        abort(400, 'create-story error: empty media')
    if ('storyDate' not in data):
        abort(400, 'create-story error: empty storyDate')
    if('location' not in data ):
        abort(400, 'create-story error: empty location')
    DBValidation(data)

    count=db.posts.find({}).count()
    dbresponse = db.posts.insert_one({
        'id':count+1,
        'story': data['story'],
        'topic': data['topic'],
        'tags': data['tags'],
        #    'likes':[ObjectId(person) for person in data['likes']],
        #    'comments':[ObjectId(person) for person in data['comments']],
        'multimedia': data['multimedia'],
        'owner_username': data['owner_username'],
        'location': data['location'],
        'postTime': datetime.datetime.utcnow(),
        'storyDate': data['storyDate'],
        'numberOfLikes': 0,
        'numberOfComments': 0,

        })
    return(jsonify({'status': 200,
        'id': str(dbresponse.inserted_id)}))
   

        
@story_bp.route('/api/story/<int:id>',  methods=['GET'])
def getStory(id):
    db = mongo.db
    dbResponse = db.posts.find_one({'id': id}, {'_id': False})
    if not dbResponse:
        abort(404,'user not found')
    return jsonify(dbResponse)

def DBValidation(data):
    db = mongo.db
    if('owner_username' not in data):
            abort(400, 'create-story error: empty username ')
    else:
        isUserExist = db.users.find_one({'username': data['owner_username']}, {'_id': False})
        if(not isUserExist):
            abort(400, 'create-story error: no such user exist')
    if ('location' not in data):
            abort(400, 'create-story error: empty location')
    else:
        isLocationExist=db.locations.find_one({'_id':  ObjectId(oid=data['location'])} )
        print(isLocationExist)
        if(not isLocationExist):
            abort(400, 'create-story error: specified location does not exist')









