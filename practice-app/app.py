from flask import Flask, jsonify, make_response
from .database import mongo
from .profile import profile
from .follow import follow
from .viewPost import viewPost
from .editPost import editPost
import datetime
from .likes import likes

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/db"

mongo.init_app(app)

db = mongo.db

db.users.drop()

app.register_blueprint(follow.follow_bp, url_prefix='/api')

db.posts.drop()

app.register_blueprint(profile.profile_bp)
app.register_blueprint(viewPost.viewPostDetails_bp)
app.register_blueprint(editPost.editPostDetails_bp)

db.likes.drop()

app.register_blueprint(likes.likes_bp)


db.users.insert_one({
        'username': 'ryan',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
        'location': 'Istanbul',
        'birthday': '29.02.2000',
        'isVisible': 'False',
        'postIds': [3],
        'followRequests': [],
        'followers': [],
        'followings': [],
        'savedPosts':[]
})

db.users.insert_one({
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'bunubir@hocayasorayim.com',
        'location': 'Corum',
        'birthday': '29.02.2000',
        'isVisible': 'True',
        'postIds': [2],
        'followRequests': [],
        'followers': [],
        'followings': [],
        'savedPosts':[]
})

db.posts.insert_one({
        'owner_username': 'ryan',
        'id'        : 2,
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2020, 6, 12, 19, 59, 40, 2),
        'storyDate' : {'start': datetime.datetime(2017, 1, 1), 'end': datetime.datetime(2017, 3, 1)},
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'bike'],
        'userComments'  : [{'username': 'atainan', 'comment': 'great memory!'}],
        'lastEdit'      : ' ' ,
        'numberOfLikes': '362',
        'numberOfComments': '13'

})

db.posts.insert_one({
        'owner_username': 'atainan',
        'id'        : 3,
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2019, 5, 13, 12, 4, 40, 2),
        'storyDate' : {'start': datetime.datetime(2017, 1, 1), 'end': datetime.datetime(2017, 3, 1)},
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'bike'],
        'userComments'  : [{'username': 'atainan', 'comment': 'great memory!'}],
        'lastEdit'      : ' ' ,
        'numberOfLikes': '360',
        'numberOfComments': '15'
})

db.likes.insert_one({
    "username": 'onurcan',
    "postId": 2,
    "date": datetime.datetime.now(),
})

db.posts.insert_one({
        'id'        : '1',
        'owner'     : 'atainan',
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2021, 5, 27, 12, 59, 40, 2), 
        'storyDate' : {'start': datetime.datetime(2017, 1, 1), 'end': datetime.datetime(2017, 3, 1)}, 
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'musical', 'day'],
        'userComments'  : [{'username': 'ryan', 'comment': 'great memory!'}],
        'lastEdit'      : ' ' 

})

db.posts.insert_one({
        'id'        : '2',
        'owner'     : 'ryan',
        'topic'     : 'Notre Dame de Paris Fire...',
        'story'     : 'There was a fire...',
        'location'  : 'Notre-Dame de Paris',
        'postDate'  : datetime.datetime(2021, 5, 29, 22, 30, 45, 20), 
        'storyDate' : {'start': datetime.datetime(2019, 4, 15), 'end': datetime.datetime(2019, 4, 15)}, 
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['fire', 'damage', 'history'],
        'userComments'  : [{'username': 'ryan', 'comment': 'it is so sad'}],
        'lastEdit'      : ' '
})

@app.route('/', methods=['GET'])
def index():
    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7'})

#@app.errorhandler(404)
#def not_found(error):
#    return make_response(jsonify({'error': 'Task was not found'}), 404)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
