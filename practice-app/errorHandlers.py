import flask
from flask import jsonify
import logging

errorHandlers_bp = flask.Blueprint('Error Handlers', __name__)


@errorHandlers_bp.app_errorhandler(400) 
def bad_request(error):
    logging.getLogger("app").error(error)
    return jsonify({'error': error.description}), 400


@errorHandlers_bp.app_errorhandler(403)
def action_forbidden(error):
    logging.getLogger("app").error(error)
    return jsonify({'error': error.description}), 403


@errorHandlers_bp.app_errorhandler(404)
def not_found(error):
    logging.getLogger("app").error(error)
    return jsonify({'error': error.description}), 404




