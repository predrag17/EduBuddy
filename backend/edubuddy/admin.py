from django.contrib import admin
from .models import EduBuddyUser, Role, Material, Quiz, Question

admin.site.register(EduBuddyUser)
admin.site.register(Role)
admin.site.register(Material)
admin.site.register(Quiz)
admin.site.register(Question)
# Register your models here.