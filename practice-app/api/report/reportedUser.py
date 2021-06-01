from flask import Blueprint, jsonify
from ...database import mongo

report_bp = Blueprint('Report', __name__)

@report_bp.route('/api/report/<int:userId>', methods=['POST'])
def postReport(userId):

    db = mongo.db
    dbresponse =  db.reports.insert_one({'userId': userId})

    if not dbresponse:
        return jsonify({"exact_match": "", "recommendations": [], "comment": "Database Error"}), 400

    return jsonify({"userId": userId}), 201
