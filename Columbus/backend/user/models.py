from django.contrib.auth.models import User
from django.db import models

class Story(models.Model):
    title = models.CharField(max_length=100)
    text = models.CharField(max_length=3000, default="")
    multimedia = models.CharField(max_length=100, default="")
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)
    time_start = models.DateField()
    time_end = models.DateField(blank=True, null=True)
    createDateTime = models.DateTimeField(auto_now_add=True)
    lastUpdate = models.DateTimeField(auto_now=True)
    numberOfLikes = models.IntegerField(default=0)
    numberOfComments = models.IntegerField(default=0)

class Tag(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    tag = models.CharField(max_length=100)

class Location(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    location = models.CharField(max_length=100)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    type = models.CharField(max_length=100, default="")


class Report(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    reporter_id = models.ForeignKey(User,on_delete=models.CASCADE)
    report = models.CharField(max_length=500)

class Like(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)

class Comment(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)
    text = models.CharField(max_length=500)


class Following(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_id')
    follow = models.ForeignKey(User, on_delete=models.CASCADE,related_name='follow')

class Profile(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    biography = models.CharField(max_length=500,null=True)
    birthday = models.DateField(null=True)
    location =models.IntegerField(null=True)
