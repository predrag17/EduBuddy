from django.urls import path
from . import views
from .views import MaterialView, UpdateUserView, CategoryView, \
    CategoryDetailView, GenerateQuestionsView, DownloadQuizResultView, QuizResultSummaryView, SaveQuizResultView, \
    MaterialDetailView, ConversationListView, ChatMessagesView

urlpatterns = [
    path('chatbot/message', views.ChatbotMessageView.as_view(), name='chatbot_message'),
    path('chatbot/messages/<int:conversation_id>', ChatMessagesView.as_view(), name='chatbot_messages'),
    path('chatbot/conversations', ConversationListView.as_view(), name='chatbot_conversations'),
    path('register', views.RegisterUserView.as_view(), name='register'),
    path('login', views.UserLoginView.as_view(), name='login'),
    path('logout', views.UserLogoutView.as_view(), name='logout'),
    path('authenticate', views.AuthenticateUserView.as_view(), name='authenticate_user'),
    path('category', CategoryView.as_view(), name='category-list'),
    path('category/update/<int:pk>', CategoryDetailView.as_view(), name='category-detail'),
    path('category/delete/<int:pk>', CategoryDetailView.as_view(), name='category-detail'),
    path('material', MaterialView.as_view()),
    path('material/<int:pk>', MaterialDetailView.as_view()),
    path('material/update/<int:material_id>', MaterialView.as_view()),
    path('material/delete/<int:material_id>', MaterialView.as_view()),
    path('user/update', UpdateUserView.as_view(), name='update-user'),
    path("questions", GenerateQuestionsView.as_view(), name="question-list"),
    path('quizzes/<int:quiz_id>/download-result', DownloadQuizResultView.as_view(), name='download-quiz-result'),
    path('quizzes/results', QuizResultSummaryView.as_view(), name='quiz-results-summary'),
    path('quiz-result/create', SaveQuizResultView.as_view(), name='quiz-results-create'),
]
