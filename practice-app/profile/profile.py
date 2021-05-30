from flask import Blueprint, request, jsonify, abort
from ..database import mongo

profile_bp = Blueprint('User Profiles', __name__)

@profile_bp.route('/user/<string:username>', methods=['GET'])
def getProfile(username):
    
    db = mongo.db
    dbresponse = db.users.find({'username': username}, {'_id': False})

    if not dbresponse:
        return 'not found xd'

    return jsonify(list(dbresponse))

# bu iptal simdilik
#@profile_bp.route('/search/user', methods=['POST'])
#def searchUser():
    # assuming the search string is stored in the key 'value'
    #value = dict(request.form)

    #dbresponse1 = \
        #dynamo.tables['users'].query(KeyConditionExpression=Key('username').eq(value['value']))
    #dbresponse2 = \
        #dynamo.tables['users'].query(KeyConditionExpression=Key('first_name').eq(value['value']))
    #dbresponse3 = \
        #dynamo.tables['users'].query(KeyConditionExpression=Key('last_name').eq(value['value']))

    #return jsonify(items=[dbresponse1['Items'], dbresponse2['Items'], dbresponse3['Items']])
