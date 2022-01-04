from ..models import *
from rest_framework import generics
from ..serializers import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.core import serializers
from datetime import datetime
import ast
import json

class AdminLogin(generics.CreateAPIView):
    serializer_class = AdminLoginSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'admin_username', 'admin_password'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        admin_username = body.get('admin_username')
        admin_password = body.get('admin_password')
        try:
            admin = Admin.objects.get(admin_username=admin_username)
        except:
            return JsonResponse({'return': 'Admin is not found'},status=403)


        if admin.admin_password==admin_password:
            login_hash = str(abs(hash(admin_username+admin_password+str(datetime.now()))))
            admin.login_hash=login_hash
            admin.save()
            return JsonResponse({'return': login_hash})
        else:
            return JsonResponse({'return': 'Password is not valid'},status=400)

class GetReportStory(generics.CreateAPIView):
    serializer_class = AdminSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        login_hash = body.get('login_hash')
        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)
        reported_story = Report.objects.all().values().first()
        try:
            stories = Story.objects.filter(id=reported_story['story_id_id'])
        except:
            return JsonResponse({'return': 'There is no reported story'})

        serialized_obj = serializers.serialize('json', stories)
        serialized_obj = json.loads(str(serialized_obj))
        result = [each["fields"] for each in serialized_obj]
        result_list = []
        for i, each in enumerate(result):
            result_dict = dict()
            each["owner_username"] = stories[i].user_id.username
            each["is_liked"] = False
            each["story_id"] = stories[i].id

            locations = Location.objects.filter(story_id=stories[i])
            serialized_obj = serializers.serialize('json', locations)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"] for each in serialized_obj]
            [each.pop('story_id', None) for each in serialized_obj]
            each["locations"] = serialized_obj

            tags = Tag.objects.filter(story_id=stories[i])
            serialized_obj = serializers.serialize('json', tags)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"]["tag"] for each in serialized_obj]
            each["tags"] = serialized_obj

            multimedias = Multimedia.objects.filter(story_id=stories[i])
            serialized_obj = serializers.serialize('json', multimedias)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"]["path"] for each in serialized_obj]
            each["multimedias"] = serialized_obj

            start_dates = Date.objects.filter(story_id=stories[i], start_end_type="start")
            serialized_obj = serializers.serialize('json', start_dates)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"] for each in serialized_obj]
            [each.pop('story_id', None) for each in serialized_obj]
            [each.pop('start_end_type', None) for each in serialized_obj]
            each["time_start"] = serialized_obj

            end_dates = Date.objects.filter(story_id=stories[i], start_end_type="end")
            serialized_obj = serializers.serialize('json', end_dates)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"] for each in serialized_obj]
            [each.pop('story_id', None) for each in serialized_obj]
            [each.pop('start_end_type', None) for each in serialized_obj]
            each["time_end"] = serialized_obj

            profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
            serialized_obj = serializers.serialize('json', profiles)
            serialized_obj = json.loads(str(serialized_obj))
            serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
            each["photo_url"] = serialized_obj
            result_dict['reported_story'] = each
            result_dict['report'] = reported_story['report']
            result_dict['reporter_id'] = reported_story['reporter_id_id']
            result_dict['report_id'] = reported_story['id']
            result_list.append(result_dict)
        return JsonResponse({'return': result_list})

class AdminActionReportStory(generics.CreateAPIView):
    serializer_class = AdminActionSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash','report_id','safe'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        login_hash = body.get('login_hash')
        report_id = body.get('report_id')
        safe = body.get('safe')

        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        try:
            report = Report.objects.get(id=report_id)
        except:
            return JsonResponse({'return': 'Report does not exist'}, status=400)

        if safe:
            report.delete()
            return JsonResponse({'return': 'Report is deleted without any action'})
        else:
            reported_story=report.story_id
            spam_story = SpamStory(title=reported_story.title, text=reported_story.text, user_id=reported_story.user_id, numberOfLikes=0, numberOfComments=0)
            spam_story.save()
            reported_story.delete()
            report.delete()
            return JsonResponse({'return': 'Story is carried to the spam folder'})

class GetReportUser(generics.CreateAPIView):
    serializer_class = AdminSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        login_hash = body.get('login_hash')
        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        report = ReportUser.objects.all().values().first()
        if not report:
            return JsonResponse({'return': 'No Reported User'})
        try:
            user_info = User.objects.get(id=report['reported_id_id'])
        except:
            return JsonResponse({'response': 'provide valid user_id or user does not exist'})

        try:
            profile_info = Profile.objects.get(user_id=user_info)
        except:
            profile_info = Profile.objects.create(user_id=user_info)
        followings_query = Following.objects.filter(user_id=user_info).values('follow', 'follow__username')
        followings = []
        for user in followings_query:
            temp = dict()
            temp['user_id'] = user['follow']
            temp['username'] = user['follow__username']
            temp['photo_url'] = Profile.objects.get(user_id=user['follow']).photo_url
            followings.append(temp)

        followers_query = Following.objects.filter(follow=user_info).values('user_id', 'user_id__username')
        followers = []
        for user in followers_query:
            temp = dict()
            temp['user_id'] = user['user_id']
            temp['username'] = user['user_id__username']
            temp['photo_url'] = Profile.objects.get(user_id=user['user_id']).photo_url
            followers.append(temp)

        try:
            location = ast.literal_eval(profile_info.location)
        except:
            location = None
        user_dict = {
            'first_name': user_info.first_name,
            'last_name': user_info.last_name,
            'birthday': profile_info.birthday,
            'location': location,
            'photo_url': profile_info.photo_url,
            'username': user_info.username,
            'email': user_info.email,
            'followers': followers,
            'followings': followings,
            'biography': profile_info.biography,
            'user_id': user_info.id,
            'public': profile_info.public
        }
        result_dict = {
            'reported_user':user_dict,
            'report_text':report['report'],
            'report_id':report['id']
        }
        return JsonResponse({'return': result_dict})

class AdminActionReportUser(generics.CreateAPIView):
    serializer_class = AdminActionSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash','report_id','safe'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        login_hash = body.get('login_hash')
        report_id = body.get('report_id')
        safe = body.get('safe')

        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        try:
            report = ReportUser.objects.get(id=report_id)
        except:
            return JsonResponse({'return': 'Report does not exist'}, status=400)

        if safe:
            report.delete()
            return JsonResponse({'return': 'Report is deleted without any action'})
        else:
            report.reported_id.is_active = False
            report.reported_id.save()
            report.delete()
            return JsonResponse({'return': 'User is carried to the black list'})

class AdminRemoveFromBlackList(generics.CreateAPIView):
    serializer_class = BlackListSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash','username'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        login_hash = body.get('login_hash')
        username = body.get('username')

        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        try:
            user = User.objects.get(username=username)
        except:
            return JsonResponse({'response': 'provide valid username or user does not exist'})

        user.is_active=True
        user.save()

        return JsonResponse({'response': f'{username} is removed from black list'})

class GetReportComment(generics.CreateAPIView):
    serializer_class = AdminSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        login_hash = body.get('login_hash')
        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        reported_comment = ReportComment.objects.all().first()
        try:
            comments = Comment.objects.filter(id=reported_comment.comment_id.id)
        except:
            return JsonResponse({'return': 'There is no reported comment'})
        serialized_obj = serializers.serialize('json', comments)
        serialized_obj = json.loads(str(serialized_obj))
        serialized_obj = [dict(each["fields"], **{"id": each["pk"]}) for each in serialized_obj]

        for each in serialized_obj:
            each["username"] = User.objects.get(id=each["user_id"]).username
            each['photo_url'] = Profile.objects.get(user_id__id=each["user_id"]).photo_url
        result_dict = {
            "reported_comment": serialized_obj[0],
            "report":reported_comment.report,
            "report_id":reported_comment.id,
            'reporter_id' : reported_comment.reporter_id.id
        }

        return JsonResponse({'return': result_dict})

class AdminActionReportComment(generics.CreateAPIView):
    serializer_class = AdminActionSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash','report_id','safe'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        login_hash = body.get('login_hash')
        report_id = body.get('report_id')
        safe = body.get('safe')

        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        try:
            report = ReportComment.objects.get(id=report_id)
        except:
            return JsonResponse({'return': 'Report does not exist'}, status=400)

        if safe:
            report.delete()
            return JsonResponse({'return': 'Report is deleted without any action'})
        else:
            reported_comment = report.comment_id
            spam_comment = SpamComment(story_id=reported_comment.story_id, text=reported_comment.text, user_id=reported_comment.user_id,parent_comment_id=reported_comment.parent_comment_id)
            spam_comment.save()
            reported_comment.delete()
            report.delete()
            return JsonResponse({'return': 'Comment is carried to the spam folder'})

class GetReportTag(generics.CreateAPIView):
    serializer_class = AdminSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)
        login_hash = body.get('login_hash')
        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        reported_tag = ReportTag.objects.all().first()
        try:
            tag = Tag.objects.filter(id=reported_tag.tag_id.id).values()[0]
        except:
            return JsonResponse({'return': 'There is no reported tag'})

        result_dict = {
            "reported_tag":tag,
            "report":reported_tag.report,
            "reporter_id":reported_tag.reporter_id.id,
            "report_id":reported_tag.id
        }
        return JsonResponse({'return': result_dict})

class AdminActionReportTag(generics.CreateAPIView):
    serializer_class = AdminActionSerializer
    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'login_hash','report_id','safe'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        login_hash = body.get('login_hash')
        report_id = body.get('report_id')
        safe = body.get('safe')
        try:
            Admin.objects.get(login_hash=login_hash)
        except:
            return JsonResponse({'return': 'Invalid Hash'}, status=400)

        try:
            report = ReportTag.objects.get(id=report_id)
        except:
            return JsonResponse({'return': 'Report does not exist'}, status=400)

        if safe:
            report.delete()
            return JsonResponse({'return': 'Report is deleted without any action'})
        else:
            reported_tag = report.tag_id
            spam_tag = SpamTag(story_id=reported_tag.story_id, tag=reported_tag.tag)
            spam_tag.save()
            reported_tag.delete()
            report.delete()
            return JsonResponse({'return': 'Tag is carried to the spam folder'})
