from django.db import models

class Test(models.Model):
    user_name = models.CharField(max_length=200)
    message = models.CharField(max_length=200)
# Create your models here.
