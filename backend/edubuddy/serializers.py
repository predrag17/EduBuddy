# edubuddy/serializers.py

from rest_framework import serializers
from .models import EduBuddyUser, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)

    class Meta:
        model = EduBuddyUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'role_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)

        try:
            default_role = Role.objects.get(name="USER")
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role": "Default role 'User' does not exist in the database."})

        validated_data['role'] = default_role

        user = EduBuddyUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
