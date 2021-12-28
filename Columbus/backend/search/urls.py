from django.urls import path
from .views import *

urlpatterns = [
path('title_exact_search/', TitleExactSearch.as_view()),
path('text_exact_search/', TextExactSearch.as_view()),
path('title_partial_search/', TitlePartialSearch.as_view()),
path('geographical_search/', GeographicalSearch.as_view()),
path('date_search/', DateSearch.as_view()),
path('location_search/', LocationSearch.as_view()),
path('user_search/', UserSearch.as_view()),
path('search/', Search.as_view()),
]
