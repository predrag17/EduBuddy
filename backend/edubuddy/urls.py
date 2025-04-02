from django.urls import path
from . import views
from .views import register_user, user_login, user_logout

urlpatterns = [
    path('chatbot/message', views.ChatbotMessageView.as_view(), name='chatbot_message'),
    path('register', register_user, name='register'),
    path('login', user_login, name='login'),
    path('logout', user_logout, name='logout'),
]
