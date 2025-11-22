from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.send_message, name='send_message'),
    path('history/', views.get_history, name='get_history'),
]

