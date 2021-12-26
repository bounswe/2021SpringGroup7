from django.test import TestCase
from ..models import *
from django.contrib.auth.models import User
import ast
from ..views import *

class MockRequest:
    def __init__(self, method, body, user=None,uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri
        self.user=user

    def build_absolute_uri(self):
        return self.absolute_uri

class AdminTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="user_name", email="user_email@gmail.com", password="123456", first_name="test", last_name="test")
        self.profile = Profile.objects.create(user_id=self.user,photo_url='temp.png',biography='temp likes being cool',birthday='2021-05-05',location=[{"location": "changed_asd", "latitude": 1901, "longitude": 120, "type": "Real"}])
        self.story = Story.objects.create(title="title", text="", multimedia="", user_id=self.user, time_start="2020-01-01", time_end="2021-01-01", numberOfLikes=0, numberOfComments=0)
        self.comment = Comment(story_id=self.story, text="new text", user_id=self.user)
        self.tag = Tag.objects.create(story_id=self.story, tag="travel")
        self.report_user = ReportUser(reported_id=self.user,reporter_id=self.user,report="dummy report")
        self.report_story = Report(story_id=self.story,reporter_id=self.user,report="dummy report")
        self.report_tag = ReportTag(tag_id=self.tag,reporter_id=self.user,report="dummy report")
        self.report_comment = ReportComment(comment_id=self.comment,reporter_id=self.user,report="dummy report")
        self.admin =Admin.objects.create(admin_username = "admin", admin_password="admin")
        self.admin.login_hash = "test_hash"
        self.admin.save()
        self.user.save()
        self.profile.save()
        self.story.save()
        self.comment.save()
        self.tag.save()
        self.report_comment.save()
        self.report_tag.save()
        self.report_story.save()
        self.report_user.save()

    def test_get_reported_story(self):
        request = MockRequest(method='GET',body={"login_hash":"test_hash"})
        get_report_story = admin.GetReportStory()
        response = get_report_story.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"][0]["reported_story"]["title"], "title")

    def test_action_reported_story(self):
        request = MockRequest(method='GET',body={"login_hash":"test_hash","report_id":self.report_story.id,"safe":False})
        admin_action_report_story = admin.AdminActionReportStory()
        response = admin_action_report_story.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'Story is carried to the spam folder')

    def test_get_reported_user(self):
        request = MockRequest(method='GET', body={"login_hash": "test_hash"})
        get_report_user = admin.GetReportUser()
        response = get_report_user.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"]["reported_user"]["first_name"], "test")

    def test_action_reported_user_add(self):
        request = MockRequest(method='GET',body={"login_hash": "test_hash", "report_id": self.report_user.id, "safe": False})
        admin_action_report_user = admin.AdminActionReportUser()
        response = admin_action_report_user.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'User is carried to the black list')

    def test_action_reported_user_remove(self):
        request = MockRequest(method='GET',body={"login_hash": "test_hash", "report_id": self.report_user.id, "safe": False})
        admin_action_report_user = admin.AdminActionReportUser()
        response = admin_action_report_user.post(request=request)
        request = MockRequest(method='GET',body={"login_hash": "test_hash", "username": self.report_user.reported_id.username})
        remove_from_black_list = admin.AdminRemoveFromBlackList()
        response = remove_from_black_list.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["response"], 'user_name is removed from black list')

    def test_get_reported_comment(self):
        request = MockRequest(method='GET', body={"login_hash": "test_hash"})
        get_report_comment = admin.GetReportComment()
        response = get_report_comment.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"]["reported_comment"]['username'], 'user_name')

    def test_action_reported_comment(self):
        request = MockRequest(method='GET',body={"login_hash": "test_hash", "report_id": self.report_comment.id, "safe": False})
        admin_action_report_comment = admin.AdminActionReportComment()
        response = admin_action_report_comment.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'Comment is carried to the spam folder')

    def test_get_reported_tag(self):
        request = MockRequest(method='GET', body={"login_hash": "test_hash"})
        get_report_tag = admin.GetReportTag()
        response = get_report_tag.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"]["reported_tag"]['tag'], 'travel')

    def test_action_reported_tag(self):
        request = MockRequest(method='GET',body={"login_hash": "test_hash", "report_id": self.report_tag.id, "safe": False})
        admin_action_report_tag = admin.AdminActionReportTag()
        response = admin_action_report_tag.post(request=request).content
        response = json.loads(response.decode('utf-8'))
        self.assertEqual(response["return"], 'Tag is carried to the spam folder')


