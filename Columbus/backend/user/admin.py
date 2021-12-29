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
admin.site.register(Blocking)
admin.site.register(Pin)
admin.site.register(ReportUser)
admin.site.register(ReportTag)
admin.site.register(ReportComment)
admin.site.register(PinnedComment)
admin.site.register(Admin)
admin.site.register(SpamStory)
admin.site.register(SpamComment)
admin.site.register(SpamTag)
admin.site.register(Date)
admin.site.register(Multimedia)
