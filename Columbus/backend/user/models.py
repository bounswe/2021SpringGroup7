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

class ReportUser(models.Model):
    reported_id = models.ForeignKey(User,on_delete=models.CASCADE,related_name='reported_id')
    reporter_id = models.ForeignKey(User,on_delete=models.CASCADE,related_name='reporter_id')
    report = models.CharField(max_length=500)

class ReportTag(models.Model):
    tag_id = models.ForeignKey(Tag,on_delete=models.CASCADE)
    reporter_id = models.ForeignKey(User,on_delete=models.CASCADE)
    report = models.CharField(max_length=500)

class Like(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)

class Comment(models.Model):
    story_id = models.ForeignKey(Story,on_delete=models.CASCADE)
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=500)
    parent_comment_id = models.IntegerField(null=True)


class ReportComment(models.Model):
    comment_id = models.ForeignKey(Comment,on_delete=models.CASCADE)
    reporter_id = models.ForeignKey(User,on_delete=models.CASCADE)
    report = models.CharField(max_length=500)

class Pin(models.Model):
    comment_id = models.ForeignKey(Comment,on_delete=models.CASCADE)
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)


class Following(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_id')
    follow = models.ForeignKey(User, on_delete=models.CASCADE,related_name='follow')

class Blocking(models.Model):
    user_id_block = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_id_block')
    block = models.ForeignKey(User, on_delete=models.CASCADE,related_name='block')

class Profile(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    photo_url = models.CharField(max_length=500,null=True)
    biography = models.CharField(max_length=500,null=True)
    birthday = models.DateField(null=True)
    location = models.CharField(null=True,max_length=500)
    public = models.BooleanField(default=True)

class ActivityStream(models.Model):
    class Meta:
        db_table = 'activity_stream'
    type = models.CharField(max_length=30)
    actor = models.ForeignKey(User, on_delete=models.CASCADE,related_name='actor')
    target = models.ForeignKey(User, null=True, on_delete=models.CASCADE,related_name='target')
    comment = models.ForeignKey(Comment, null=True, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, null=True, on_delete=models.CASCADE)
    date = models.DateTimeField()
