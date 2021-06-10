import datetime
from os import error
from re import A, search
from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify, abort
from flask_pymongo import ASCENDING
from pymongo.bulk import _WRITE_CONCERN_ERROR
from database import mongo
import requests

# from flask_cors import CORS


story_bp = Blueprint('Story', __name__)
# CORS(story_bp)
# cors = CORS(story_bp, resources={r"/*": {"origins": "*"}})


@story_bp.route('/api/story/create',  methods=['POST'])
def createStory(): 
    data = request.get_json()
    db = mongo.db
    
    print(data)
    inputCheck(data)
    DBValidation(data)
    try:
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
        updated = {'$push': { 'postIds':count+1
            }}

        db.users.update_one({'username':data['owner_username']},updated)
       


        return ({'status':200,'id':(count+1)})
    except:
        abort(400,'DB error')
    
   

        
@story_bp.route('/api/story/<int:id>',  methods=['GET'])
def getStory(id):
    db = mongo.db
    dbResponse = db.posts.find_one({'id': id}, {'_id': False})
    if not dbResponse:
        abort(404,'get story info:story not found')
    return jsonify(dbResponse)

def DBValidation(data):
    db = mongo.db
    if('owner_username' not in data):
            abort(400, 'create-story error: empty username ')
    else:
        isUserExist = db.users.find_one({'username': data['owner_username']}, {'_id': False})
        if(not isUserExist):
            abort(400, 'create-story error: no such user exist')
    # if ('location' not in data):
    #         abort(400, 'create-story error: empty location')
    # else:
    #     isLocationExist=db.locations.find_one({'_id':  ObjectId(oid=data['location'])} )
        
        # if(not isLocationExist):
        #     abort(400, 'create-story error: specified location does not exist')




def inputCheck(data):
    if ('location' not in data):
        abort(403, 'create-story error: empty location')
    if('owner_username' not in data):
        abort(403, 'create-story error: empty username ')
    if ('story' not in data):
        abort(403, 'create-story error: empty story')
    if ('topic' not in data):
        abort(403, 'create-story error: empty topic')
    if ('tags' not in data):
        abort(403, 'create-story error: empty tags')
    if ('multimedia' not in data):
        abort(403, 'create-story error: empty media')
    if ('storyDate' not in data):
        abort(403, 'create-story error: empty storyDate')
    if('location' not in data ):
        abort(403, 'create-story error: empty location')
    return(True)

# WEATHER API 
@story_bp.route('/api/story/weather/<int:id>',  methods=['GET'])
def getWeatherInfo(id):
    db = mongo.db
    dbResponse = db.posts.find_one({'id': id}, {'_id': False})
    
    if(not dbResponse):
        abort(404, 'get weather error: story not found ')
    location=db.locations.find_one({'_id':  ObjectId(oid=dbResponse['location'])} )

    if(not location):
        abort(404, 'get weather error: location not found ')
    longitude=location['longitude']
    latitude=location['latitude']
    apiResponse= requests.get('https://www.metaweather.com/api/location/search/?lattlong='+str(latitude)+ ','+str(longitude) ).json()
    apiLocationID=apiResponse[0]

    apiResponse=requests.get('https://www.metaweather.com/api/location/'+str(apiLocationID['woeid']))
    result=apiResponse.json()
    result=result['consolidated_weather']

    resultJson=[{'state':days['weather_state_name'],'img':'https://www.metaweather.com/static/img/weather/png/64/'+days['weather_state_abbr'] +'.png','temp':days['the_temp']} for days in result]
    resultJson=jsonify(resultJson)    

    return resultJson




