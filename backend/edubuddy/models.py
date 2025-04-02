# edubuddy/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class EduBuddyUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)
    password = models.CharField(max_length=255)

    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email
