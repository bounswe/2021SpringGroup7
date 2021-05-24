'''

@author Ismail Ata Inan

'''

from flask import Flask, jsonify
from .database import dynamo
from .profile import profile

app = Flask(__name__)

app.config['AWS_ACCESS_KEY_ID'] = 'atalanta'
app.config['AWS_SECRET_ACCESS_KEY'] = 'verysecret'

app.config['DYNAMO_ENABLE_LOCAL'] = True
app.config['DYNAMO_LOCAL_HOST'] = 'localhost'
app.config['DYNAMO_LOCAL_PORT'] = 8042

app.config['DYNAMO_TABLES'] = [
    {
         'TableName' : 'users',
         'KeySchema' : [dict(AttributeName='username', KeyType='HASH')],
         'AttributeDefinitions' : [dict(AttributeName='username', AttributeType='S')],
         'ProvisionedThroughput' : dict(ReadCapacityUnits=5, WriteCapacityUnits=5)
    } 
]

dynamo.init_app(app)

with app.app_context():
    dynamo.create_all()

app.register_blueprint(profile.profile_bp)

dynamo.tables['users'].put_item(Item={
        'username': 'ryan',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
        'location': 'Istanbul',
        'birthday': '29.02.2000',
        'isVisible': 'False'
})

dynamo.tables['users'].put_item(Item={
        'username': 'atainan',
        'first_name': 'ata',
        'last_name': 'inan',
        'email': 'bunubir@hocayasorayim.com',
        'location': 'Corum',
        'birthday': '29.02.2000',
        'isVisible': 'True'
})



@app.route('/', methods=['GET'])
def index():
    return jsonify({'Uygulama calisiyor mu': 'evet', 'En iyi grup': 'Grup 7'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
