from django.urls import path
from . import views
from .views import MaterialView, UpdateUserView, QuizView, QuizDetailView, QuestionView, DownloadQuizView, CategoryView, \
    CategoryDetailView

urlpatterns = [
    path('chatbot/message', views.ChatbotMessageView.as_view(), name='chatbot_message'),
    path('register', views.RegisterUserView.as_view(), name='register'),
    path('login', views.UserLoginView.as_view(), name='login'),
    path('logout', views.UserLogoutView.as_view(), name='logout'),
    path('authenticate', views.AuthenticateUserView.as_view(), name='authenticate_user'),
    path('category', CategoryView.as_view(), name='category-list'),
    path('category/update/<int:pk>', CategoryDetailView.as_view(), name='category-detail'),
    path('category/delete/<int:pk>', CategoryDetailView.as_view(), name='category-detail'),
    path('material', MaterialView.as_view()),
    path('material/update/<int:pk>', MaterialView.as_view()),
    path('material/delete/<int:pk>', MaterialView.as_view()),
    path('user/update', UpdateUserView.as_view(), name='update-user'),
    path('quiz', QuizView.as_view()),
    path('quiz/<int:pk>', QuizDetailView.as_view()),
    path('question', QuestionView.as_view()),
    path('question/<int:pk>', QuestionView.as_view()),
    path('quiz/download/<int:pk>', DownloadQuizView.as_view()),

]
