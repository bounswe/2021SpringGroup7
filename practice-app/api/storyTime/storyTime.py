from bson.objectid import ObjectId
from flask import Blueprint, request,abort
from database import mongo
from flask_cors import CORS
import re

storyTime_bp = Blueprint('StoryTime', __name__)

cors = CORS(storyTime_bp, resources={r"/*": {"origins": "*"}})


@storyTime_bp.route('api/storytime/create-storytime',  methods=['POST'])
def createStoryTime():
    print(request)

    data = request.get_json()
    db = mongo.db
    validateDate(data)
    dbresponse = db.storytimes.insert_one({
        'dateOne': data['dateOne'],
        'dateTwo': data['dateTwo'],
        'dateType': data['dateType']
    })

    return(dbresponse.inserted_id)


def createStoryTime_method(data):
    print(data)
    db = mongo.db
    validateDate(data)

    try:
        dbresponse = db.storytimes.insert_one({
            'dateOne': data['dateOne'],
            'dateTwo': data['dateTwo'],
            'dateType': data['dateType']
        })
        return(str(dbresponse.inserted_id))
    except:
        abort(400)
    
def validateDate(data):
    if(data['dateOne']):
        print('here')
        res=re.search('^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$',data['dateOne'])
        if(not res):
            abort(400,'date error')
    if(data['dateTwo']):
        print('here')
        res=re.search('^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$',data['dateTwo'])
        if(not res):
            abort(400,'date error')
    
