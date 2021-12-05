from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Story)
admin.site.register(Tag)
admin.site.register(Location)
admin.site.register(Report)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Following)
admin.site.register(Profile)
