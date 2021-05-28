from flask import Flask, jsonify
from .database import mongo
from .profile import profile
from .search import search

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/db"
app.config['JSON_AS_ASCII'] = False

mongo.init_app(app)

db = mongo.db

db.users.drop()
db.locations.drop()

app.register_blueprint(profile.profile_bp)
app.register_blueprint(search.search_bp)

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
    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
