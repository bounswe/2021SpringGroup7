from django.urls import path
from .views import *

urlpatterns = [
path('title_exact_search/', TitleExactSearch.as_view()),
path('text_exact_search/', TextExactSearch.as_view()),
]
