# edubuddy/serializers.py

from rest_framework import serializers
from .models import EduBuddyUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduBuddyUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print(validated_data)
        password = validated_data.pop('password', None)
        user = EduBuddyUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
