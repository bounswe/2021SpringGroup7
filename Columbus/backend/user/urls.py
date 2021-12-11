from django.urls import path
from . import views

urlpatterns = [
path('logout/', views.logout.Logout.as_view()),
path('profile_post/', views.profile_post.ProfilePost.as_view()),
path('create_post/', views.post_create.PostCreate.as_view()),
path('get_profile/<str:user_id>/', views.profile.GetProfileInfo.as_view()),
path('set_profile/', views.profile.SetProfileInfo.as_view()),
path('follow/', views.follow.Follow.as_view()),

]
