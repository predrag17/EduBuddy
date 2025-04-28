# edubuddy/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


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
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f"{self.quiz.title} - {self.text[:30]}..."


class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{'✓ ' if self.is_correct else ''}{self.text}"


class Result(models.Model):
    description = models.TextField(blank=True)
    grade = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    quiz = models.OneToOneField(Quiz, on_delete=models.CASCADE)

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Results for {self.quiz.title} by {self.quiz.user.username} - Grade: {self.grade}"
