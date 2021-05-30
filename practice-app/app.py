from flask import Flask, jsonify, make_response
from .database import mongo
from .profile import profile
from .report import reportedUser

from .postDetails import postDetails
from .comment import comment

from .search import search
from .likes import likes
from .follow import follow
from .savePost import savePost
from .home import home
from .viewPost import viewPost
from .editPost import editPost
import datetime
from .likes import likes

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/db"
app.config['JSON_AS_ASCII'] = False

mongo.init_app(app)

db = mongo.db

db.users.drop()
db.reports.drop()
db.locations.drop()
db.likes.drop()
db.posts.drop()
db.comments.drop()

app.register_blueprint(savePost.savePost_bp)
app.register_blueprint(profile.profile_bp)
app.register_blueprint(reportedUser.report_bp)


app.register_blueprint(postDetails.postDetails_bp)
app.register_blueprint(comment.comment_bp)
app.register_blueprint(home.home_bp)
app.register_blueprint(follow.follow_bp, url_prefix='/api')
app.register_blueprint(viewPost.viewPostDetails_bp)
app.register_blueprint(editPost.editPostDetails_bp)
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
        'followings': ['ryan'],
        'savedPosts':[]
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
        'userComments'  : '',
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
        'userComments'  : '',
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
        'userComments'  : '',
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
        'userComments'  : ' ',
        'lastEdit'      : ' ' ,
        'numberOfLikes': '362',
        'numberOfComments': '13',
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

db.reports.insert_one({
        'userId': 4
})

db.likes.insert_one({
    "username": 'onurcan',
    "postId": 2,
    "date": datetime.datetime.now(),
})

locations_list = [{"location_name": "      boğaziçi                        üniversitesi           ", "story_ids": [3, 5, 7, 14, 53, 1356], "latitude": 38, "longitude": 45},
{"location_name": "koç üniversitesi", "story_ids": [8, 5, 635, 8758, 53764], "latitude": 39, "longitude": 35},
{"location_name": "istanbul     ", "story_ids": [1, 8, 7653, 64, 1356], "latitude": 32, "longitude": 55},
{"location_name": "rize", "story_ids": [0, 1, 413, 542, 413453, 154314356], "latitude": 34, "longitude": 46},
{"location_name": "paris", "story_ids": [17, 3, 413, 314], "latitude": 35, "longitude": 44},
{"location_name": "Londra", "story_ids": [431, 4, 61534, 542], "latitude": 36, "longitude": 42},
{"location_name": "washington", "story_ids": [4314, 5, 431, 4315, 53, 1356], "latitude": 37, "longitude": 41},
{"location_name": "Albert Long Hall", "story_ids": [64, 8, 317, 5, 1356], "latitude": 34, "longitude": 48},
{"location_name": "Karaman", "story_ids": [76, 1], "latitude": 36, "longitude": 47},
{"location_name": "Denizli", "story_ids": [433, 415, 437431, 154254], "latitude": 35, "longitude": 35},
{"location_name": "deniz", "story_ids": [143, 1345, 3217, 11434, 53, 765356], "latitude": 33, "longitude": 36},
{"location_name": "          taksim meydanı", "story_ids": [434, 15, 7321, 141344,1356], "latitude": 32, "longitude": 38},
{"location_name": "atatürk bulvarı", "story_ids": [4314, 235, 7321], "latitude": 31, "longitude": 32},
{"location_name": "tower      bridge", "story_ids": [65, 3215, 2137, 14134, 4356], "latitude": 28, "longitude": 34},
{"location_name": "boğaziçi köprüsü", "story_ids": [413, 35, 2137, 431414, 54233, 1356, 4314, 4131], "latitude": 48, "longitude": 45}
]


db.locations.insert_many(locations_list)

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
