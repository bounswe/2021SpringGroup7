from flask import Blueprint, jsonify, abort
from database import mongo
from flasgger import swag_from
import datetime

likes_bp = Blueprint('Like action and viewing user which likes post', __name__)

@likes_bp.route('/api/post/<int:postId>/likes', methods=['GET'])
@swag_from('../../apidocs/likes/getLikes.yml')
def getLikes(postId):
    postExist = findPostFromDb(postId)
    
    if not postExist:
        abort(404, 'Post is not found')

    userThatLikesPost = getLikesFromDb(postId)
    if not userThatLikesPost:
        abort(404, 'Post is not liked')

    postLikes = list(userThatLikesPost)
    if len(postLikes) == 0:
        abort(404, 'Post is not liked')
        
    data = {
        'items': postLikes,
        'totalCount': len(postLikes)
    }
    
    return jsonify(data)

@likes_bp.route('/api/post/<int:postId>/likes/<string:username>', methods=['POST'])
@swag_from('../../apidocs/likes/likePost.yml')
def likePost(postId,username):
    postExist = findPostFromDb(postId)
    if not postExist:
        abort(404, 'Post is not found')

    userExist = findUserFromDb(username)
    if not userExist:
        abort(404, 'User is not found')
        
    likedPostData = list(likedPostInfo(postId, username))
    numberOfLikes = len(list(getLikesFromDb(postId)))


    if not len(likedPostData) == 0:
        removeLikePostFromDb(likedPostData[0])
        updatePostLikesDb(postId, numberOfLikes)
        return { "message" : "Like is reverted", "status" : 200}
    else:
        likeInstance = {
            "username": username,
            "postId": postId,
            "date": datetime.datetime.now(),
        }
        addLikePostToDb(likeInstance)
        updatePostLikesDb(postId, numberOfLikes)
        return { "message" : "Post liked successfully", "status" : 200}

def updatePostLikesDb(postId, numberOfLikes):
    db = mongo.db
    query = { 'id' : postId }            
    updatedPost = { '$set': {'numberOfLikes': numberOfLikes} }  
    db.posts.update_many(query, updatedPost)

def getLikesFromDb(postId):
    db = mongo.db
    return db.likes.find({'postId': postId}, {'_id': False})

def findPostFromDb(postId):
    db = mongo.db
    return db.posts.find_one({'id': postId}, {'_id': False})

def findUserFromDb(username):
    db = mongo.db
    return db.users.find_one({'username': username})

def addLikePostToDb(likeInstance):
    db = mongo.db
    db.likes.insert_one(likeInstance)

def removeLikePostFromDb(likedPostData):
    db = mongo.db
    db.likes.delete_one(likedPostData)

def likedPostInfo(postId, username):
    db = mongo.db
    return db.likes.find({ "postId": postId,'username': username})

