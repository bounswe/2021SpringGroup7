from flask import Flask, jsonify
from .database import mongo
from .profile import profile
from .postDetails import postDetails

import datetime #

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/db"

mongo.init_app(app)

db = mongo.db

db.users.drop()
db.posts.drop()

app.register_blueprint(profile.profile_bp)
app.register_blueprint(postDetails.postDetails_bp)

db.users.insert_one({
        'username': 'ryan',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
        'location': 'Istanbul',
        'birthday': '29.02.2000',
        'isVisible': 'False'
})

db.users.insert_one({
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'bunubir@hocayasorayim.com',
        'location': 'Corum',
        'birthday': '29.02.2000',
        'isVisible': 'True'
})

post1 = {
        'topic'     : 'Great Day In Rome...',
        'story'     : 'I was in Rome for about 3 months...',
        'location'  : 'Rome',
        'postDate'  : datetime.datetime(2021, 5, 27, 12, 59, 40, 2), 
        'storyDate' : {'start': datetime.datetime(2017, 1, 1), 'end': datetime.datetime(2017, 3, 1)}, 
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['summer', 'musical', 'day'],
        'userComments'  : [{'username': 'atainan', 'comment': 'great memory!'}],
        'lastEdit'      : ' ' 

}
post2 = {
        'topic'     : 'Notre Dame de Paris Fire...',
        'story'     : 'There was a fire...',
        'location'  : 'Notre-Dame de Paris',
        'postDate'  : datetime.datetime(2021, 5, 29, 22, 30, 45, 20), 
        'storyDate' : {'start': datetime.datetime(2019, 4, 15), 'end': datetime.datetime(2019, 4, 15)}, 
        'multimedia': ['photo_link_1','photo_link_2'],
        'tags'      : ['fire', 'damage', 'history'],
        'userComments'  : [{'username': 'ryan', 'comment': 'it is so sad'}],
        'lastEdit'      : ' ' 

}
post_mongoId_1 = str(db.posts.insert_one(post1).inserted_id)
post_mongoId_2 = str(db.posts.insert_one(post2).inserted_id)

print(post_mongoId_1)


@app.route('/', methods=['GET'])
def index():
    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
