from django.contrib import admin

# Register your models here.

from .models import Conversation, Illustration

admin.site.register(Conversation)
admin.site.register(Illustration)
