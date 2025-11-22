from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_message', 'bot_response', 'created_at']
    list_filter = ['user', 'created_at']
    search_fields = ['user_message', 'bot_response']
    readonly_fields = ['created_at']

