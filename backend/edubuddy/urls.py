from django.urls import path
from . import views

urlpatterns = [
    path('chatbot/message', views.ChatbotMessageView.as_view(), name='chatbot_message'),
    path('register', views.RegisterUserView.as_view(), name='register'),
    path('login', views.UserLoginView.as_view(), name='login'),
    path('logout', views.UserLogoutView.as_view(), name='logout'),
    path('authenticate', views.AuthenticateUserView.as_view(), name='authenticate_user'),
]
