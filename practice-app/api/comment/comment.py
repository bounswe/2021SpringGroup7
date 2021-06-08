from flask import Blueprint, request, jsonify, abort
from database import mongo
import requests
from datetime import datetime



comment_bp = Blueprint('Comments', __name__)

@comment_bp.route('/api/post/<int:post>/comments', methods=['GET'])
def getComments(post):

    db = mongo.db
    dbresponse = getCommentFromDb(post)
    postinfo = getPostFromDb(post)
    if not postinfo:
        abort(404, 'post info:post not found')
    if not dbresponse:
        abort(404, 'get comment error:no comments in this post')

    return jsonify(dbresponse)
@comment_bp.route('/api/post/<int:post>/comments/new/<string:username>', methods=['POST'])
def makeComment(post,username):

    db = mongo.db
    user = getUserFromDb(username)
    postinfo = getPostFromDb(post)
    if not postinfo:
        abort(400, 'no such post exists')
    if not user:
        abort(400,'no such user exists')

    commentText=request.form
    text = commentText.get('text')
    lang=requests.post('https://ws.detectlanguage.com/0.2/detect',{'q':text},auth=('a133a45152facfa243ff514da79b9a09','')).json()
    language=lang['data']['detections'][0]['language']
    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M")
    commentj = {
        "username": username,
        "comment": text,
        "postId": post,
        "date": dt_string,
        "language": language
    }
    db.comments.insert_one({
            'username': username,
            'comment':text,
            'postId':post,
            'date': dt_string,
            'language':language
    })
    count = postinfo['numberOfComments']
    newnumber = {'$set': {'numberOfComments': count + 1}}
    db.posts.update_one(postinfo,newnumber)
    return jsonify(commentj)

def getCommentFromDb(post):
    db=mongo.db
    dbresponse = db.comments.find({'postId': post}, {'_id': False})
    return dbresponse

def getPostFromDb(post):
    db=mongo.db
    dbresponse = db.posts.find_one({'id': post}, {'_id': False})
    return dbresponse

def getUserFromDb(username):
    db = mongo.db
    return db.users.find_one({'username': username})


