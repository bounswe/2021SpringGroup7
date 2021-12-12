from ..serializers import *
from rest_framework import generics
from django.http import JsonResponse
from ..models import *
from django.core import serializers
import json


class HomePage(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = HomePageSerializer

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'page_number', 'page_size'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        username = body.get('username')
        page_number = body.get('page_number')
        page_size = body.get('page_size')

        if page_number<1:
            result = []
            return JsonResponse({'return': result}, status=200)

        followings = Following.objects.filter(user_id__username=username).values("follow")
        stories = []
        for user in followings:
            temp_stories = Story.objects.filter(user_id__username=user.username)
            for story in temp_stories:
                stories.insert(story)

        stories = sorted(stories, key=lambda temp_story: temp_story.createDateTime, reverse=True)
        stories = stories[(page_number-1)*page_size: page_number*page_size]

        if len(stories)!= 0:
            serialized_obj = serializers.serialize('json', stories)
            serialized_obj = json.loads(str(serialized_obj))

            result = [each["fields"] for each in serialized_obj]
        else:
            result = []

        return JsonResponse({'return': result}, status=200)
