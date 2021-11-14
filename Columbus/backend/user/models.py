from django.db import models


class User(models.Model):
    user_name   = models.CharField(max_length=50,unique=True,null=False)
    first_name  = models.CharField(max_length=50,null=True)
    last_name   = models.CharField(max_length=50,null=True)
    user_email  = models.EmailField(max_length=70,unique=True,null=False)
    password    = models.CharField(max_length=200,null=False)
# Create your models here.
