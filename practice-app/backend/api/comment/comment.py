from flask import Blueprint, request, jsonify, abort
from database import mongo
import requests
from datetime import datetime
from flasgger import swag_from


comment_bp = Blueprint('Comments', __name__)
#This endpoint returns comments of posts from database
@comment_bp.route('/api/post/<int:post>/comments', methods=['GET'])
@swag_from('../../apidocs/comment/getComments.yml')
def getComments(post):

    db = mongo.db
    dbresponse = getCommentFromDb(post)
    postinfo = getPostFromDb(post)
    if not postinfo:
        abort(404, 'post info:post not found')
    if not dbresponse:
        abort(404, 'get comment error:no comments in this post')

    return jsonify(list(dbresponse))
#This endpoint takes a string from user and create a comment
@comment_bp.route('/api/post/<int:post>/comments/new/<string:username>', methods=['POST'])
@swag_from('../../apidocs/comment/makeComment.yml')
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

    #I used detectlanguage as third party api. It returns possible language of text.
    lang=requests.post('https://ws.detectlanguage.com/0.2/detect',{'q':text},auth=('a133a45152facfa243ff514da79b9a09','')).json()
    language=lang['data']['detections'][0]['language']
    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M")          #Date of comment day/month/year hour:minute
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
    newnumber = {'$set': {'numberOfComments': count + 1}}           #increment comment number in post object
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


