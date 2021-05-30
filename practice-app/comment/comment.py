from flask import Blueprint, request, jsonify, abort
from ..database import mongo
import requests
import datetime


comment_bp = Blueprint('Comments', __name__)

@comment_bp.route('/post/<int:post>/comments', methods=['GET'])
def getComments(post):

    db = mongo.db
    dbresponse = db.comments.find({'postId': post}, {'_id': False})

    if not dbresponse:
        return 'not found xd'

    return jsonify(list(dbresponse))
@comment_bp.route('/post/<int:post>/comments/new/<string:username>', methods=['POST'])
def makeComment(post,username):

    db = mongo.db
    commentText=request.form
    text = commentText.get('text')
    lang=requests.post('https://ws.detectlanguage.com/0.2/detect',{'q':text},auth=('a133a45152facfa243ff514da79b9a09','')).json()
    language=lang['data']['detections'][0]['language']
    commentj = {
        "username": username,
        "comment": text,
        "postId": post,
        "date": datetime.datetime.now(),
        "language": language
    }
    db.comments.insert_one({
            'username': username,
            'comment':text,
            'postId':post,
            'date': datetime.datetime.now(),
            'language':language
    })


    return jsonify(commentj)