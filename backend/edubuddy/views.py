import json

from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from knox.models import AuthToken

from .models import EduBuddyUser
from .serializers import UserSerializer
from edubuddy.management.commands.query_data import query_rag


# Class-based view for the chatbot endpoint
class ChatbotMessageView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            message = data.get('message', '')

            response = query_rag(message)

            return JsonResponse({
                'message': response
            }, status=200)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


# Class-based view for user registration
class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Class-based view for user login
class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(username=username, password=password)
            if not user:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            _, token = AuthToken.objects.create(user=user)

            user_data = UserSerializer(user).data

            return Response({
                'token': token,
                'user': user_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Class-based view for user logout (authenticated)
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            AuthToken.objects.filter(user=request.user).delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Class-based view for authenticate user (check if user is logged in)
class AuthenticateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.username
        try:
            user = EduBuddyUser.objects.get(username=username)
        except EduBuddyUser.DoesNotExist:
            raise NotFound(detail="User not found.")

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
