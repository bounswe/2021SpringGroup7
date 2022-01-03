from ..serializers import *
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import *
import json
from django.http import JsonResponse
from django.core import serializers
from ..functions import filter_result

class Explore(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = HomePageSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username','page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        page_number = body.get('page_number')
        page_size = body.get('page_size')

        if page_number < 1:
            result = []
            return JsonResponse({'return': result}, status=200)

        stories = Story.objects.filter()

        most_commented_posts = self.get_sorted_comments(stories,sort_key='comment',page_number=page_number,page_size=page_size,request=request)
        most_liked_posts = self.get_sorted_comments(stories, sort_key='like', page_number=page_number,
                                                        page_size=page_size,request=request)
        latest_posts = self.get_sorted_comments(stories, sort_key='date', page_number=page_number,
                                                        page_size=page_size,request=request)

        try:
            latest_posts = filter_result(request.user,latest_posts)
            most_liked_posts = filter_result(request.user, most_liked_posts)
            most_commented_posts = filter_result(request.user, most_commented_posts)
        except:
            pass

        result_dict = {'most_commented_posts':most_commented_posts,
                       'most_liked_posts':most_liked_posts,
                       'latest_posts':latest_posts}

        return JsonResponse({'return': result_dict})


    def get_sorted_comments(self,stories,sort_key,page_number,page_size,request):
        if sort_key=='comment':
            stories = sorted(stories, key=lambda story: story.numberOfComments, reverse=True)
        elif sort_key=='like':
            stories = sorted(stories, key=lambda story: story.numberOfLikes, reverse=True)
        elif sort_key=='date':
            stories = sorted(stories, key=lambda story: story.createDateTime, reverse=True)

        stories = stories[(page_number-1)*page_size: page_number*page_size]

        if len(stories)!=0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))


            result = [each["fields"] for each in serialized_obj]
            for i, each in enumerate(result):
                each["owner_username"] = stories[i].user_id.username
                each["is_liked"] = len(Like.objects.filter(story_id=stories[i], user_id__username=request.user))>0
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

                try:
                    profiles = Profile.objects.filter(user_id__username=stories[i].user_id.username)
                    serialized_obj = serializers.serialize('json', profiles)
                    serialized_obj = json.loads(str(serialized_obj))
                    serialized_obj = [each["fields"]["photo_url"] for each in serialized_obj][0]
                    each["photo_url"] = serialized_obj
                except:
                    each["photo_url"] = None
            return result
        else:
            return  []