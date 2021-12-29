from rest_framework.response import Response
from ..serializers import *
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from ..models import *

class GetNotifications(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = GetNotificationsSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        body = request.data
        required_areas = {'user_name', 'limit'}
        if set(body.keys()) != required_areas:
            return JsonResponse({'return': 'Required areas are:' + str(required_areas)}, status=400)

        username = body.get('user_name')
        limit = int(body.get('limit'))
        follow_requests = ActivityStream.objects.filter(type='FollowRequest', target__username=username)
        follow_requests = follow_requests.order_by('-date')
        other_notifications = ActivityStream.objects.filter(story__user_id__username=username).exclude(story=None) | \
                              ActivityStream.objects.filter(type='Follow', target__username=username) | \
                              ActivityStream.objects.filter(type='Unfollow', target__username=username) | \
                              ActivityStream.objects.filter(type='CommentUpdate', comment__story_id__user_id__username=username) | \
                              ActivityStream.objects.filter(type='Pin', comment__user_id__username=username) | \
                              ActivityStream.objects.filter(type='Unpin', comment__user_id__username=username)
        other_notifications = other_notifications.order_by('-date')
        length = len(other_notifications)
        other_notifications = other_notifications[:limit]
        follow_requests = create_story_notifications(follow_requests)
        notifications = create_story_notifications(other_notifications)
        response = {"follow_requests": follow_requests, "numberOfOtherNotifications": length, "other_notifications": notifications}
        return JsonResponse(response, status=200)


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
        return JsonResponse(response, status=200)

def _comment_create(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} added comment to story : {activity.story.id} ",
            "id": activity.id,
            "type": "CommentCreate",
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            },
    }
def _followrequest(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} has requested to follow {activity.target.username}",
            "id": activity.id,
            "type": "FollowRequest",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "target": {
                "type": "https://schema.org/Person",
                "@id": activity.target.username,
            }
    }
def _follow(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} followed {activity.target.username}",
            "id": activity.id,
            "type": "Follow",
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "summary": f"{activity.actor.username} unliked {activity.story.id} ",
            "id": activity.id,
            "type": "Unlike",
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
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
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.target.username
            },
    }

def _reportcommentcreate(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} reported {activity.comment.id} ",
            "id": activity.id,
            "type": "ReportCommentCreate",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.comment.id
            },
    }

def _reporttagcreate(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} reported {activity.tag.id} ",
            "id": activity.id,
            "type": "ReportTagCreate",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.tag.id
            },
    }

def create_activity_response(activities):
    functions = {'SetProfile': _setprofile, 'Follow': _follow,'Unfollow':_unfollow, 'UpdatePost': _updatepost,
                 'DeletePost': _deletepost, "CreatePost": _createpost, 'Logout': _logout, 'Like': _like, 'Unlike': _unlike
                 , 'CommentUpdate': _comment_update, 'CommentCreate': _comment_create, 'CommentDelete':  _comment_delete,
                 'Block': _block,'Unblock':_unblock, 'Pin': _pin,'Unpin':_unpin, 'ReportStoryCreate':_reportstorycreate,
                  'ReportUserCreate':_reportusercreate,'ReportCommentCreate':_reportcommentcreate,'FollowRequest': _followrequest,
                'ReportTagCreate':_reporttagcreate,
                    }
    response = {"@context": "https://www.w3.org/ns/activitystreams",
                "summary": "Activity stream",
                "type": "OrderedCollection",
                "total_items": len(activities)}
    items = []
    for activity in activities:
        items.append(functions[activity.type](activity))

    response['orderedItems'] = items
    return response

def create_story_notifications(story_notifications):
    notification_list = ['Follow','Unfollow','Like', 'Unlike','CommentUpdate','CommentCreate', 'Pin', 'Unpin','FollowRequest']
    functions = { 'Follow': _follow,'Unfollow':_unfollow, 'Like': _like_notify, 'Unlike': _unlike_notify
                 , 'CommentUpdate': _comment_update_notify, 'CommentCreate': _comment_create_notify,
                  'Pin': _pin_notify,'Unpin':_unpin_notify,'FollowRequest': _followrequest}
    response = {"@context": "https://www.w3.org/ns/notification",
                "summary": "Notifications List",
                "type": "OrderedCollection",
                "total_items": len(story_notifications)}
    items = []
    for notification in story_notifications:
        if notification.type in notification_list:
            items.append(functions[notification.type](notification))

    response['orderedItems'] = items
    return response


def _comment_update_notify(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} updated comment : {activity.comment.text}",
            "id": activity.id,
            "type": "CommentUpdate",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            },
    }

def _like_notify(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} liked story with title : {activity.story.title} ",
            "id": activity.id,
            "type": "Like",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            }
    }

def _unlike_notify(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} unliked story with title {activity.story.title} ",
            "id": activity.id,
            "type": "Unlike",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            }
    }

def _comment_create_notify(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} added comment to story with title : {activity.story.title} ",
            "id": activity.id,
            "type": "CommentCreate",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/ShortStory",
                "@id": activity.story.id
            },
    }

def _unpin_notify(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} unpinned comment : {activity.comment.text} ",
            "id": activity.id,
            "type": "Unpin",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            }
    }

def _pin_notify(activity):
    return {
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": f"{activity.actor.username} pinned comment : {activity.comment.text}",
            "id": activity.id,
            "type": "Pin",
            "date": activity.date,
            "actor": {
                "type": "https://schema.org/Person",
                "@id": activity.actor.username,
            },
            "object": {
                "type": "https://schema.org/Comment",
                "@id": activity.comment.id
            }
    }