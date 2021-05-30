from os import abort
from bson.objectid import ObjectId
from flask import Blueprint, request,abort
from flask.json import JSONEncoder, jsonify
from ..database import mongo
from flask_cors import CORS

media_bp = Blueprint('Media', __name__)
CORS(media_bp)
cors = CORS(media_bp, resources={r"/*": {"origins": "*"}})


@media_bp.route('/multimedia/create-multimedia',  methods=['POST'])
def createMedia():
    data = request.get_json()
    db = mongo.db 
    try:
        dbresponse = db.multimedias.insert_one({
            'types': [item for item in data['types']],
            'urls': [item for item in data['srcs']],

        })

        return(str(dbresponse.inserted_id))
    except:
        abort(400)
@media_bp.route('/multimedia/<string:id>',  methods=['GET'])
def getMedia(id):
    print(id)
    db = mongo.db 

    dbresponse = db.multimedias.find_one({'_id' : ObjectId(str(id))})
    print(dbresponse)
    return (dbresponse)
    # print(dbresponse)
    # if(dbresponse):
        
    #     print(dbresponse._read_preference)
    # abort(jsonify(404,'not found' ))


def createMedia_method(data):
    db = mongo.db
    try:
        dbresponse = db.multimedias.insert_one({
            'types': [item for item in data['types']],
            'urls': [item for item in data['srcs']],

        })

        return(str(dbresponse.inserted_id))
    except :
        abort(400)