# edubuddy/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class EduBuddyUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)
    password = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.PROTECT, null=False)

    REQUIRED_FIELDS = ["first_name", "last_name"]


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Material(models.Model):
    subject = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='data/')
    is_processed = models.BooleanField(default=False)

    # Timestamp
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Relationships
    user = models.ForeignKey(EduBuddyUser, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.subject


class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(EduBuddyUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Question(models.Model):
    DIFFICULTY_LEVELS = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    difficulty = models.CharField(
        max_length=15,
        choices=DIFFICULTY_LEVELS,
        default="easy"
    )

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'Correct' if self.is_correct else 'Incorrect'})"


class QuizResult(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey(EduBuddyUser, on_delete=models.CASCADE)
    score = models.IntegerField()
    total_questions = models.IntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}/{self.total_questions}"


class QuestionResult(models.Model):
    quiz_result = models.ForeignKey(QuizResult, related_name="question_results", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField()

    def __str__(self):
        return f"{self.question.text[:30]}... - {'True' if self.is_correct else 'False'}"
