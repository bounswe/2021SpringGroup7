from rest_framework.response import Response
from ..serializers import *
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from ..models import *
from ..models import ActivityStream


class ActivityStream(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CommentCreateSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'username', 'limit'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        username = body.get('username')
        limit = int(body.get('limit'))
        offset = int(body.get('offset'))

        try:
            user_id = User.objects.get(username=username)
        except:
            return JsonResponse({'return': 'user not found'}, status=400)

        if offset == 0:
            activities = ActivityStream.objects.order_by('-date')[:limit]
        else:
            activities = ActivityStream.objects.filter(id__lte=offset).order_by('-date')[:limit]

        response = create_activity_response(activities)
        return Response(response, status=200)

def _comment_create(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} added comment to {activity.target.story_id} ",
            "id": activity.id,
            "type": "CreateComment",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.story_id
            },
    }

def _comment_update(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} updated comment to {activity.target.story_id} ",
            "id": activity.id,
            "type": "UpdateComment",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.story_id
            },
    }

def _follow(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} followed {activity.object.username}",
            "id": activity.id,
            "type": "Follow",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Person",
                "@id": activity.object.username,
            }
    }

def _like(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} liked {activity.target.story_id} ",
            "id": activity.id,
            "type": "Like",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.story_id
            }
    }

def _logout(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} logged out ",
            "id": activity.id,
            "type": "Logout",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            }
    }

def _createpost(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} created post",
            "id": activity.id,
            "type": "CreatePost",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            }
    }

def _updatepost(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} updated {activity.target.story_id} ",
            "id": activity.id,
            "type": "UpdatePost",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.story_id
            },
    }

def _deletepost(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} deleted {activity.target.story_id} ",
            "id": activity.id,
            "type": "DeletePost",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.story_id
            },
    }

def _setprofile(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} set profile informations.",
            "id": activity.id,
            "type": "SetProfile",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            }
    }

def create_activity_response(activities):
    functions = {'SetProfile': _setprofile, 'Follow': _follow, 'UpdatePost': _updatepost,
                'DeletePost': _deletepost, "CreatePost": _createpost, 'Logout': _logout, 'Like': _like
                 , 'CommentUpdate': _comment_update, 'CommentCreate': _comment_create}
    response = {"@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Activity stream",
                "type": "OrderedCollection",
                "total_items": len(activities)}
    items = []
    for activity in activities:
        items.append(functions[activity.type](activity))

    response['orderedItems'] = items
    return response
