from django.urls import path
from . import views
from .views import MaterialView, UpdateUserView

urlpatterns = [
    path('chatbot/message', views.ChatbotMessageView.as_view(), name='chatbot_message'),
    path('register', views.RegisterUserView.as_view(), name='register'),
    path('login', views.UserLoginView.as_view(), name='login'),
    path('logout', views.UserLogoutView.as_view(), name='logout'),
    path('authenticate', views.AuthenticateUserView.as_view(), name='authenticate_user'),
    path('materials', MaterialView.as_view()),
    path('materials/update/<int:pk>', MaterialView.as_view()),
    path('materials/delete/<int:pk>', MaterialView.as_view()),
    path('user/update', UpdateUserView.as_view(), name='update-user'),

]
