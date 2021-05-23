# app.py

from flask import Flask
from flask_dynamo import Dynamo

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
    }, {
         'TableName' : 'groups',
         'KeySchema' : [dict(AttributeName='name', KeyType='HASH')],
         'AttributeDefinitions' : [dict(AttributeName='name', AttributeType='S')],
         'ProvisionedThroughput' : dict(ReadCapacityUnits=5, WriteCapacityUnits=5)
    }
]

dynamo = Dynamo(app)

with app.app_context():
    dynamo.create_all()

dynamo.tables['users'].put_item(Item={
        'username': 'rdegges',
        'first_name': 'Randall',
        'last_name': 'Degges',
        'email': 'r@rdegges.com',
})


@app.route('/')
def index():
    st = ''
    for table_name, table in dynamo.tables.items():
        st += str(table_name) + ',' + str(table) + ' '
    return st

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
