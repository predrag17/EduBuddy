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
