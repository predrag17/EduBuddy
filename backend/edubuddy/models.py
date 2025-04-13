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

class Material(models.Model):
    CHOICES = (
        ('Primary School', 'Primary School'),
        ('High School', 'High School'),
        ('College', 'College'),
    )

    subject = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='materials/')
    is_processed = models.BooleanField(default=False)
    category = models.CharField(max_length=50, choices=CHOICES)

    #Timestamp
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    #Releationships
    user = models.ForeignKey(EduBuddyUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject