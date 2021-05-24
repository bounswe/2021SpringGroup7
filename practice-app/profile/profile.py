'''

@author Ismail Ata Inan

'''

from flask import Blueprint, request, jsonify, abort
from ..database import dynamo

profile_bp = Blueprint('User Profiles', __name__)

@profile_bp.route('/user/<string:username>', methods=['GET', 'POST'])
def getProfile(username):

    if request.method == 'POST':
        # daha arayuz olmadigi icin arama yapamiyoru
        pass

    dbresponse = dynamo.tables['users'].get_item(Key={'username': username})

    if 'Item' not in dbresponse:
        return 'not found xd'

    return jsonify(dbresponse['Item'])
