from django.urls import path
from . import views

urlpatterns = [
path('logout/', views.logout.Logout.as_view()),
path('profile_post/', views.profile_post.ProfilePost.as_view()),
path('create_post/', views.post.PostCreate.as_view()),
path('edit_post/', views.post.PostEdit.as_view()),
path('delete_post/', views.post.PostDelete.as_view()),
path('get_profile/<str:user_id>/', views.profile.GetProfileInfo.as_view()),
path('set_profile/', views.profile.SetProfileInfo.as_view()),
path('follow/', views.follow.Follow.as_view()),
path('block/', views.block.Block.as_view()),
path('like/', views.like.LikePost.as_view()),
path('pin_comment/', views.pin.PinComment.as_view()),
path('home_page/', views.home_page.HomePage.as_view()),
path('get_likes/<str:story_id>/', views.like.GetPostLikes.as_view()),
path('comment_create/', views.comment.CommentCreate.as_view()),
path('comment_update/', views.comment.CommentUpdate.as_view()),
path('comment_delete/', views.comment.CommentDelete.as_view()),
path('get_comments/', views.comment.GetComment.as_view()),
path('get_user_likes/', views.like.GetUserLikes.as_view()),
path('activity_stream/', views.activity_stream.ActivityStreamAPI.as_view()),
path('report_story/', views.report.ReportStory.as_view()),
path('report_user/', views.report.ReportUserAPI.as_view()),
path('delete_profile/', views.profile.DeleteProfile.as_view()),
path('admin/login', views.admin.AdminLogin.as_view()),
path('admin/get_reported_stories', views.admin.GetReportStory.as_view()),
path('admin/action_reported_stories', views.admin.AdminActionReportStory.as_view()),
path('admin/get_reported_users', views.admin.GetReportUser.as_view()),
path('admin/action_reported_users', views.admin.AdminActionReportUser.as_view()),
path('admin/remove_users_from_black_list', views.admin.AdminRemoveFromBlackList.as_view()),
path('admin/get_reported_comments', views.admin.GetReportComment.as_view()),
path('admin/action_reported_comments', views.admin.AdminActionReportComment.as_view()),
path('admin/get_reported_tags', views.admin.GetReportTag.as_view()),
path('admin/action_reported_tags', views.admin.AdminActionReportTag.as_view()),
]
