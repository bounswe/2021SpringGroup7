from flask import Flask, jsonify, make_response
from .database import mongo
from .profile import profile

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/db"

mongo.init_app(app)

db = mongo.db

db.users.drop()

app.register_blueprint(profile.profile_bp)

db.users.insert_one({
        'username': 'ryan',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
        'location': 'Istanbul',
        'birthday': '29.02.2000',
        'isVisible': 'False',
        'posts': ['postid1', 'postid2'],
        'followRequests': [],
        'followers': [],
        'followings': []
})

db.users.insert_one({
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'bunubir@hocayasorayim.com',
        'location': 'Corum',
        'birthday': '29.02.2000',
        'isVisible': 'True',
        'posts': ['postid3', 'postid4'],
        'followRequests': [],
        'followers': [],
        'followings': []
})


@app.route('/', methods=['GET'])
def index():
    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7'})

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Task was not found'}), 404)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
