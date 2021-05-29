from flask import Blueprint, abort, request
from ..database import mongo
import requests

savePost_bp = Blueprint('Saving Post', __name__)


@savePost_bp.route('/api/<string:username>/savings/', methods=['POST'])
def savePost(username):

    post = request.form
    db = mongo.db

    if not list(db.users.find({'username': username})):
        return abort(404, "User not found")
    if not list(db.posts.find({'id': int(post.get('id'))})):
        return abort(404, "Post not found")

    user_who_sent_the_request = requests.get(f'http://127.0.0.1:5000/user/{username}').json()[0]
    key = {'username': username}
    user_who_sent_the_request['savedPost'].append(post.get('id'))
    new_image_of_the_user = {'$set': user_who_sent_the_request}
    db.users.update_one(key, new_image_of_the_user, upsert=False)
    return abort(200, "The request was fulfilled.")
