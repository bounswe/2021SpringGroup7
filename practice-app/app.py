from flask import Flask, jsonify
from .database import mongo
from .profile import profile
from .follow import follow
from .savePost import savePost
from .home import home
import datetime

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/db"

mongo.init_app(app)

db = mongo.db

db.users.drop()
db.posts.drop()

app.register_blueprint(savePost.savePost_bp)
app.register_blueprint(profile.profile_bp)
app.register_blueprint(follow.follow_bp)
app.register_blueprint(home.home_bp)

db.users.insert_one({
        'username': 'ryan',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
        'location': 'Istanbul',
        'birthday': '29.02.2000',
        'isVisible': 'False',
        'followRequests': [],
        'followers': [],
        'followings': ['atainan'],
        'savedPost':[]
})

db.users.insert_one({
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'bunubir@hocayasorayim.com',
        'location': 'Corum',
        'birthday': '29.02.2000',
        'isVisible': 'True',
        'followRequests': [],
        'followers': [],
        'followings': ['ryan'],
        'savedPost':[]
})
db.posts.insert_one({
        'owner_username': 'ryan',
        'id'        : 4,
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2020, 8, 23, 12, 59, 40, 2),
        'storyDate' : {'start': datetime.datetime(2017, 1, 1), 'end': datetime.datetime(2017, 3, 1)},
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'bike'],
        'userComments'  : [{'username': 'atainan', 'comment': 'great memory!'}],
        'lastEdit'      : ' ' ,
        'numberOfLikes': '32',
        'numberOfComments': '2'

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
db.posts.insert_one({
        'owner_username': 'ryan',
        'id'        : 1,
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2021, 5, 27, 12, 59, 40, 2),
        'storyDate' : {'start': datetime.datetime(2017, 1, 1), 'end': datetime.datetime(2017, 3, 1)},
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'bike'],
        'userComments'  : [{'username': 'atainan', 'comment': 'great memory!'}],
        'lastEdit'      : ' ' ,
        'numberOfLikes': '362',
        'numberOfComments': '13'

})


@app.route('/', methods=['GET'])
def index():
    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
