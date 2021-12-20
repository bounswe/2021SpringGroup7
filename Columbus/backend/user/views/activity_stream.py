from rest_framework.response import Response
from ..serializers import *
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from ..models import *
from ..models import ActivityStream


class ActivityStreamAPI(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ActivityStreamSerializer

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'limit', 'offset'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        limit = int(body.get('limit'))
        offset = int(body.get('offset'))

        if offset == 0:
            activities = ActivityStream.objects.order_by('-date')[:limit]
        else:
            activities = ActivityStream.objects.filter(id__lte=offset).order_by('-date')[:limit]

        response = create_activity_response(activities)
        return Response(response, status=200)

def _comment_create(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} added comment to story : {activity.story.id} ",
            "id": activity.id,
            "type": "CommentCreate",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            },
    }

def _comment_update(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} updated comment : {activity.comment.id}  ",
            "id": activity.id,
            "type": "CommentUpdate",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            },
    }

def _comment_delete(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} deleted comment : {activity.comment.id}  ",
            "id": activity.id,
            "type": "CommentDelete",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            },
    }

def _follow(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} followed {activity.target.username}",
            "id": activity.id,
            "type": "Follow",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "target": {
                "type": "https://schema.org/Person",
                "@id": activity.target.username,
            }
    }

def _unfollow(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} unfollowed {activity.target.username}",
            "id": activity.id,
            "type": "Unfollow",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "target": {
                "type": "https://schema.org/Person",
                "@id": activity.target.username,
            }
    }

def _block(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} blocked {activity.target.username}",
            "id": activity.id,
            "type": "Block",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "target": {
                "type": "https://schema.org/Person",
                "@id": activity.target.username,
            }
    }

def _unblock(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} unblocked {activity.target.username}",
            "id": activity.id,
            "type": "Unblock",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "target": {
                "type": "https://schema.org/Person",
                "@id": activity.target.username,
            }
    }

def _like(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} liked {activity.story.id} ",
            "id": activity.id,
            "type": "Like",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            }
    }

def _unlike(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} uliked {activity.story.id} ",
            "id": activity.id,
            "type": "Unlike",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            }
    }

def _pin(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} pinned {activity.comment.id} ",
            "id": activity.id,
            "type": "Pin",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            }
    }

def _unpin(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} unpinned {activity.comment.id} ",
            "id": activity.id,
            "type": "Unpin",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
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
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            },
    }

def _updatepost(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} updated {activity.story.id} ",
            "id": activity.id,
            "type": "UpdatePost",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            },
    }

def _deletepost(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} deleted {activity.story.id} ",
            "id": activity.id,
            "type": "DeletePost",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
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

def _reportstorycreate(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} reported {activity.story.id} ",
            "id": activity.id,
            "type": "ReportStoryCreate",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            },
    }

def _reportusercreate(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} reported {activity.target.username} ",
            "id": activity.id,
            "type": "ReportUserCreate",
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.username
            },
    }

def create_activity_response(activities):
    functions = {'SetProfile': _setprofile, 'Follow': _follow,'Unfollow':_unfollow, 'UpdatePost': _updatepost,
                 'DeletePost': _deletepost, "CreatePost": _createpost, 'Logout': _logout, 'Like': _like, 'Unlike': _unlike
                 , 'CommentUpdate': _comment_update, 'CommentCreate': _comment_create, 'CommentDelete':  _comment_delete,
                 'Block': _block,'Unblock':_unblock, 'Pin': _pin,'Unpin':_unpin, 'ReportStoryCreate':_reportstorycreate,
                  'ReportUserCreate':_reportusercreate}
    response = {"@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Activity stream",
                "type": "OrderedCollection",
                "total_items": len(activities)}
    items = []
    for activity in activities:
        items.append(functions[activity.type](activity))

    response['orderedItems'] = items
    return response
