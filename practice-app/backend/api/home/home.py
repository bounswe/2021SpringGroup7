from flask import Blueprint, jsonify, abort
from database import mongo
from flasgger import swag_from
import requests
from flask_cors import CORS

home_bp = Blueprint('Home Page', __name__)
CORS(home_bp)
cors = CORS(home_bp, resources={r"/*": {"origins": "*"}})

@home_bp.route('/api/home/<string:username>', methods=['GET'])
@swag_from('../../apidocs/home/homePage.yml')
def getHome(username):

	user = getUserFromDb(username)

	if not user:
		abort(404, "User not found")

	followings=user['followings']

	if not followings:
		abort(404,"User does not have any followings")

	posts_of_the_followings=[]
	for username in followings:
		dbresponse = get_post_of_a_user(username)['posts']
		if not dbresponse:
			continue
		for post in dbresponse:
			posts_of_the_followings.append(post)

	if not posts_of_the_followings:
		abort(404, "User does not have any post to see")

	posts_of_the_followings=sorted(posts_of_the_followings, key=lambda i: i['postDate'], reverse=True)

	advice = requests.get('https://api.adviceslip.com/advice')
	advice=advice.json()['slip']['advice']

	if 'isMock' in user.keys():
		return list(posts_of_the_followings)
	posts=list(posts_of_the_followings)
	return jsonify({"posts":posts , "advice": advice}),200


def sortPost(posts_of_the_followings):
	return sorted(posts_of_the_followings, key=lambda i: i['postDate' ], reverse=True)

def get_post_of_a_user(username):
	db = mongo.db
	return {'posts':db.posts.find({'owner_username': username},{'_id': False})}

def getUserFromDb(username):
    db = mongo.db
    return db.users.find_one({'username': username},{'_id': False})