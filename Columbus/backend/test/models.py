from django.db import models
from pymongo import MongoClient

url = 'mongodb://mongo:27017'
client = MongoClient(url)
db = client['db_name']
# Create your models here.
