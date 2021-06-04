import flask
from flask import jsonify, make_response

errorHandlers_bp = flask.Blueprint('Error Handlers', __name__)

@errorHandlers_bp.app_errorhandler(400) 
def bad_request(error):
    return make_response(jsonify({'code': error.code,'error': error.description}))

@errorHandlers_bp.app_errorhandler(403)
def action_forbidden(error):
    return  jsonify({'code': error.code,'error': error.description})

@errorHandlers_bp.app_errorhandler(404)
def not_found(error):
    return  jsonify({'code': error.code,'error': error.description})




