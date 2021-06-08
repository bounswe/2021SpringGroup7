from flask import Blueprint, abort, request,jsonify
from database import mongo
from flasgger import swag_from

savePost_bp = Blueprint('Saving Post', __name__)

@savePost_bp.route('/api/<string:username>/savings/', methods=['POST'])
@swag_from('../../apidocs/savePost/savePost.yml')
def savePost(username):

    post = getRequest()
    try:
        id=int(post.get('id'))
    except:
        abort(400, "Bad Request")

    user=getUserFromDb(username)
    post=getPostFromDb(id)

    if not user or not user['username']==username:
        abort(404, "User not found")

    if not post or not post['id']==id:
        abort(404, "Post not found")

    response=addPostToUserArchieve(user, post)

    if 'isMock' in user.keys():
        return response

    return jsonify(response)

def addPostToUserArchieve(user,post):
    username=user['username']
    key = {'username': username}
    if post['id'] not in user['savedPosts']:
        user['savedPosts'].append(post['id'])
        new_image_of_the_user = {'$set': user}
        setUserInDb(key,new_image_of_the_user)
        return "Successful Add",200
    return "The post is already saved",200

def getUserFromDb(username):
    db = mongo.db
    return db.users.find_one({'username': username},{'_id': False})

def getPostFromDb(id):
    db = mongo.db
    return db.posts.find_one({'id': id},{'_id': False})

def setUserInDb(key,new_insert):
    db=mongo.db
    db.users.update_one(key, new_insert, upsert=False)

def getRequest():
    return request.form;





