import flask
from flask import jsonify

errorHandlers_bp = flask.Blueprint('Error Handlers', __name__)

from app import app


@errorHandlers_bp.app_errorhandler(400) 
def bad_request(error):
    app.logger.error(error)
    return jsonify({'error': error.description}), 400


@errorHandlers_bp.app_errorhandler(403)
def action_forbidden(error):
    app.logger.error(error)
    return jsonify({'error': error.description}), 403


@errorHandlers_bp.app_errorhandler(404)
def not_found(error):
    app.logger.error(error)
    return jsonify({'error': error.description}), 404




