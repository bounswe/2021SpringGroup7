from flask import Blueprint, abort, request,jsonify
from ...database import mongo
import requests

savePost_bp = Blueprint('Saving Post', __name__)


@savePost_bp.route('/api/<string:username>/savings/', methods=['POST'])
def savePost(username):

    post = request.form
    db = mongo.db

    try:
        int(post.get('id'))
    except ValueError as e:
        return abort(400, "Bad Request")

    if not list(db.users.find({'username': username})):
        return abort(404, "User not found")

    if not list(db.posts.find({'id': int(post.get('id'))})):
        return abort(404, "Post not found")

    user_who_sent_the_request = requests.get(f'http://127.0.0.1:5000/user/{username}').json()[0]
    key = {'username': username}
    if post.get('id') not in user_who_sent_the_request['savedPosts']:
        user_who_sent_the_request['savedPosts'].append(post.get('id'))
        new_image_of_the_user = {'$set': user_who_sent_the_request}
        db.users.update_one(key, new_image_of_the_user, upsert=False)
    return jsonify(200)

