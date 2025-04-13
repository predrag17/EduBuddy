from django.contrib import admin
from .models import EduBuddyUser, Role, Material

admin.site.register(EduBuddyUser)
admin.site.register(Role)
admin.site.register(Material)
# Register your models here.