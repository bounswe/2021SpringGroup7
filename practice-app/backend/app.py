from flask import Flask, jsonify,request
import datetime
from database import mongo
from errorHandlers import errorHandlers_bp
from api.profile import profile
from api.location import location
from api.story import story
from api.report import reportedUser
from api.comment import comment
from api.follow import follow
from api.savePost import savePost
from api.home import home
from api.viewPost import viewPost
from api.editPost import editPost
from api.likes import likes
from api.search import search
import logging
import sentry_sdk
from flasgger import Swagger
from sentry_sdk.integrations.flask import FlaskIntegration
import requests
from flask_cors import CORS

sentry_sdk.init(
    dsn="https://0cde92986781428cbdf66f7cdc55f2df@o793703.ingest.sentry.io/5801382",
    integrations=[FlaskIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1,

    # By default the SDK will try to use the SENTRY_RELEASE
    # environment variable, or infer a git commit
    # SHA as release, however you may want to set
    # something more human-readable.
    # release="myapp@1.0.0",
)

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)

app.config["MONGO_URI"] = "mongodb://mongo:27017/db"
app.config['JSON_AS_ASCII'] = False

logging.basicConfig(filename='output.log', level=logging.ERROR, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

mongo.init_app(app)

db = mongo.db

db.users.drop()
db.reports.drop()
db.locations.drop()
db.likes.drop()
db.posts.drop()
db.comments.drop()

app.register_blueprint(errorHandlers_bp)

app.register_blueprint(savePost.savePost_bp)
app.register_blueprint(profile.profile_bp)
app.register_blueprint(location.location_bp)

app.register_blueprint(story.story_bp)
app.register_blueprint(viewPost.viewPostDetails_bp)
app.register_blueprint(editPost.editPostDetails_bp)
app.register_blueprint(reportedUser.report_bp)
app.register_blueprint(comment.comment_bp)
app.register_blueprint(home.home_bp)
app.register_blueprint(follow.follow_bp, url_prefix='/api')
app.register_blueprint(likes.likes_bp)
app.register_blueprint(search.search_bp)


access_key = "3sKPGrmSrj112Z2Msu71wFyA-KIuIvyHEs6aJN4iMVA"

db.users.insert_one({
        'username': 'ryan',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
        'location': 'Istanbul',
        'birthday': '29.02.2000',
        'isVisible': 'False',
        'postIds': [1,2,4],
        'followRequests': [],
        'followers': ['atainan'],
        'followings': [],
        'savedPosts':[]
})
db.users.insert_one({
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'inanata15@gmail.com',
        'location': 'atasehir',
        'birthday': '29.02.2000',
        'isVisible': 'True',
        'postIds': [3, 5],
        'followRequests': [],
        'followers': [],
        'followings': ['ryan','kadirelmaci'],
        'savedPosts':[]
})
db.users.insert_one({
        'username': 'kadirelmaci',
        'first_name': 'kadir',
        'last_name': 'elmaci',
        'email': 'codeblo@yahoo.com',
        'location': 'bogazici',
        'birthday': '29.05.1990',
        'isVisible': 'True',
        'postIds': [8],
        'followRequests': [],
        'followers': ['atainan'],
        'followings': [],
        'savedPosts':[]
})
db.users.insert_one({
        'username': 'merverabia',
        'first_name': 'merve rabia',
        'last_name': 'barin',
        'email': 'rabia@boun.edu.tr',
        'location': 'hisarustu',
        'birthday': '14.09.1994',
        'isVisible': 'True',
        'postIds': [6,7],
        'followRequests': [],
        'followers': [],
        'followings': [],
        'savedPosts':[]
})
db.users.insert_one({
        'username': 'onurcanavci',
        'first_name': 'onur can',
        'last_name': 'avci',
        'email': 'onurcan@boun.edu.tr',
        'location': 'bebek',
        'birthday': '17.01.1991',
        'isVisible': 'False',
        'postIds': [9],
        'followRequests': [],
        'followers': [],
        'followings': [''],
        'savedPosts':[]
})
db.posts.insert_one({
        'owner_username': 'ryan',
        'id'        : 1,
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2020, 6, 10, 12, 00, 40, 2),
        'storyDate' : {'start': datetime.datetime(2010, 1, 1), 'end': datetime.datetime(2010, 4, 1)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['summer', 'bike'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 3,
        'numberOfComments': 2,
})
db.posts.insert_one({
        'owner_username': 'ryan',
        'id'        : 2,
        'topic'     : 'A Cat in Ankara',
        'story'     : 'In my last visit to Ankara, I came across a strange cat... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Ankara - Turkey',
        'postDate'  : datetime.datetime(2020, 6, 11, 19, 59, 40, 2),
        'storyDate' : {'start': datetime.datetime(2011, 1, 1), 'end': datetime.datetime(2011, 4, 1)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['cat', 'strange'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 2,
        'numberOfComments': 1
})
db.posts.insert_one({
        'owner_username': 'atainan',
        'id'        : 3,
        'topic'     : 'A Student In Denmark...',
        'story'     : 'I had a chance to study in Denmark... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Denmark',
        'postDate'  : datetime.datetime(2021, 8, 21, 16, 4, 42, 2),
        'storyDate' : {'start': datetime.datetime(2021, 1, 1), 'end': datetime.datetime(2021, 4, 1)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['student'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 3,
        'numberOfComments': 2
})
db.posts.insert_one({
        'owner_username': 'ryan',
        'id'        : 4,
        'topic'     : 'Remembering Childhood Days',
        'story'     : 'When I was a child... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ',
        'location'  : 'Texas',
        'postDate'  : datetime.datetime(2020, 8, 23, 12, 59, 40, 2),
        'storyDate' : {'start': datetime.datetime(1980, 1, 1), 'end': datetime.datetime(1980, 1, 1)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['nostalgic', 'childhood'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 1,
        'numberOfComments': 1
})
db.posts.insert_one({
        'owner_username': 'atainan',
        'id'        : 5,
        'topic'     : 'First Day In Bogazici',
        'story'     : 'It was my first day in Bogazici... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Bogazici University',
        'postDate'  : datetime.datetime(2021, 8, 21, 16, 4, 42, 2),
        'storyDate' : {'start': datetime.datetime(2017, 9,9), 'end': datetime.datetime(2017, 9,9)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['college', 'life'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 4,
        'numberOfComments': 0
})
db.posts.insert_one({
        'owner_username': 'merverabia',
        'id'        : 6,
        'topic'     : 'A Dream Come True',
        'story'     : 'This place is where everything has changed for me... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Grönland',
        'postDate'  : datetime.datetime(2016, 2, 12, 19, 59, 40, 2),
        'storyDate' : {'start': datetime.datetime(2016, 2, 12), 'end': datetime.datetime(2016, 2, 12)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['northern', 'lights'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 2,
        'numberOfComments': 1
})
db.posts.insert_one({
        'owner_username': 'merverabia',
        'id'        : 7,
        'topic'     : 'Relaxing Sunset in Izmir',
        'story'     : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Izmir',
        'postDate'  : datetime.datetime(2021, 5, 13, 12, 4, 40, 2),
        'storyDate' : {'start': datetime.datetime(2021, 1, 1), 'end': datetime.datetime(2021, 3, 1)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['peace'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 1,
        'numberOfComments': 0
})
db.posts.insert_one({
        'owner_username': 'kadirelmaci',
        'id'        : 8,
        'topic'     : '',
        'story'     : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Istanbul',
        'postDate'  : datetime.datetime(2020, 9, 21, 12, 4, 40, 2),
        'storyDate' : {'start': datetime.datetime(2018, 1, 5), 'end': datetime.datetime(2017, 3, 5)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['fun'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 2,
        'numberOfComments': 1
})
db.posts.insert_one({
        'owner_username': 'onurcanavci',
        'id'        : 9,
        'topic'     : 'Last Day In Bogazici',
        'story'     : 'It was both sad and a proudful day... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'location'  : 'Bogazici University',
        'postDate'  : datetime.datetime(2021, 7, 13, 12, 4, 40, 2),
        'storyDate' : {'start': datetime.datetime(2021, 6, 1), 'end': datetime.datetime(2017, 6, 1)},
        'multimedia': requests.get('https://api.unsplash.com/photos/random?client_id=' + access_key).json()["urls"]["regular"].split(),
        'tags'      : ['graduation'],
        'lastEdit'      : ' ' ,
        'numberOfLikes': 3,
        'numberOfComments': 3
})

db.reports.insert_one({
        'userId': 4
})

db.likes.insert_one({
    "username": 'onurcan',
    "postId": 1,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'merverabia',
    "postId": 1,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'atainan',
    "postId": 1,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'onurcan',
    "postId": 2,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'atainan',
    "postId": 2,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'kadirelmacı',
    "postId": 3,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'merverabia',
    "postId": 3,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'merverabia',
    "postId": 4,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'ryan',
    "postId": 5,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'onurcan',
    "postId": 5,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'merverabia',
    "postId": 5,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'kadirelmacı',
    "postId": 5,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'kadirelmacı',
    "postId": 6,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'atainan',
    "postId": 6,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'ryan',
    "postId": 7,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'ryan',
    "postId": 8,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'onurcan',
    "postId": 8,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'ryan',
    "postId": 9,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'merverabia',
    "postId": 9,
    "date": datetime.datetime.now(),
})
db.likes.insert_one({
    "username": 'kadirelmacı',
    "postId": 9,
    "date": datetime.datetime.now(),
})

db.comments.insert_one({
    "username": 'atainan',
        "comment": 'What a great story!',
        "postId": 1,
        "date": '11/11/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'merverabia',
        "comment": 'I liked it.',
        "postId": 1,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'atainan',
        "comment": 'It seems awesome!',
        "postId": 2,
        "date": '11/09/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'merverabia',
        "comment": 'Good Luck.',
        "postId": 3,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'onurcanavci',
        "comment": 'That is a big oppurtunity, I am soo happy.',
        "postId": 3,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'kadirelmaci',
        "comment": 'That was a good memory, made me feel nostalgic...',
        "postId": 4,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'atainan',
        "comment": 'I want to see it too, you are so lucky',
        "postId": 6,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'onurcanavci',
        "comment": 'Lorem ipsum, too!!!',
        "postId": 8,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'kadirelmaci',
        "comment": 'We had great memories there',
        "postId": 9,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'merverabia',
        "comment": 'It was emotional',
        "postId": 9,
        "date": '11/12/2021',
        "language": 'en'
})
db.comments.insert_one({
    "username": 'atainan',
        "comment": 'We had great dayss',
        "postId": 9,
        "date": '11/12/2021',
        "language": 'en'
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


@app.route('/', methods=['GET'])
def index():
    try:
        response = requests.get("https://api.countapi.xyz/get/columbusgroup7/apihitcount")
        hit_count = response.json()
    except requests.exceptions.RequestException as e:
        logging.getLogger("app").error(e)

    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7',"API Hit Count": hit_count['value']})

@app.after_request
def increase_hit_count(response):
    if request.path != "/":
        try:
            requests.get("https://api.countapi.xyz/hit/columbusgroup7/apihitcount")
        except requests.exceptions.RequestException as e:
            logging.getLogger("app").error(e)

    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
