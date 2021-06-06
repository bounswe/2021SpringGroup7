from flask import Blueprint, jsonify
from database import mongo
import editdistance
import json
import requests
from flasgger import swag_from

search_bp = Blueprint('Search', __name__)

turkish_characters = "çğıöşü"
english_characters = "cgiosu"
translation_table = str.maketrans(turkish_characters, english_characters) # Translate Turkish characters to English to calculate search match


def preprocess_text(text):
    text = " ".join(text.lower().split())
    return text.translate(translation_table)


@search_bp.route('/api/search/<string:searchText>', methods=['GET'])
@swag_from('../../apidocs/search/search.yml')
def search(searchText):

    # I use the language detection api from "https://detectlanguage.com/". It detects the language of a given text. I detect the language of the search text and if it not Turkish or English, I give a warning response.
    language_results = requests.get("https://ws.detectlanguage.com/0.2/detect", headers={"Authorization": "Bearer 9a517e959f9d74f49390456b06b3c076"}, params={"q":searchText})
    
    if language_results.ok:
        detected_languages = json.loads(language_results.text)['data']['detections']
        if len(detected_languages)==0:
            return jsonify({"exact_match": "", "recommendations": [], "comment": "Wrong Input"}), 400
        if not ((detected_languages[0]["language"]=="tr") or (detected_languages[0]["language"]=="en")):
            return jsonify({"exact_match": "", "recommendations": [], "comment": "Wrong Input Language"}), 400
        

    db = mongo.db
    dbresponse = db.locations.find({},{"_id": 0, "location_name": 1})

    if not dbresponse:
        return jsonify({"exact_match": "", "recommendations": [], "comment": "Database Error"}), 400
    
    location_names = [location_dict["location_name"] for location_dict in list(dbresponse)]

    exact_match = ""
    locations_with_distances = []
    preprocessed_search_text = preprocess_text(searchText)

    for location_name in location_names:
        preprocessed_location_name = preprocess_text(location_name)
        distance = editdistance.eval(preprocessed_location_name, preprocessed_search_text)
        locations_with_distances.append((distance, location_name))
        if distance==0:
            exact_match = location_name

    recommended_locations = [location_with_distance[1] for location_with_distance in sorted(locations_with_distances)[:5]]

    return jsonify({"exact_match": exact_match, "recommendations": recommended_locations, "comment": "Successful Search"}), 200
