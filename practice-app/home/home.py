from flask import Blueprint, jsonify, abort
from ..database import mongo
from ..follow.follow import getFollowings
import requests

home_bp = Blueprint('Home Page', __name__)


@home_bp.route('/api/home/<string:username>', methods=['GET'])
def getHome(username):
	db = mongo.db

	if not db.posts.find({'username': username}, {'_id': False}):
		return abort(404, "User not found")

	username_of_the_followings=getFollowings(username).json
	if not username_of_the_followings:
		return abort(404,"User does not have any post to see")

	posts_of_the_followings=[]
	for username in username_of_the_followings:
		dbresponse_as_list_of_posts = list(db.posts.find({'owner_username': username}, {'_id': False}))
		if not dbresponse_as_list_of_posts:
			continue
		for post in dbresponse_as_list_of_posts:
			posts_of_the_followings.append(post)

	if not posts_of_the_followings:
		return abort(404,"User does not have any post to see")

	posts_of_the_followings= sorted(posts_of_the_followings, key=lambda i: i['postDate' ], reverse=True)

	advice = requests.get('https://api.adviceslip.com/advice')
	advice=advice.json()['slip']['advice']

	return jsonify({"posts":list(posts_of_the_followings),"advice":advice})