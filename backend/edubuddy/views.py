import json

import os

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import JsonResponse, FileResponse

from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from knox.models import AuthToken
from .models import EduBuddyUser, Material, Quiz, Question, Result, Category

from .serializers import UserSerializer, MaterialSerializer, QuizSerializer, QuestionSerializer, ResultSerializer, \
    CategorySerializer

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


class CategoryView(APIView):
    permission_classes = [IsAuthenticated]

    # Retrieve all categories
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create a new category
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # Retrieve a single category by its ID
    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise NotFound(detail="Category not found.")

        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Update an existing category by its ID
    def put(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise NotFound(detail="Category not found.")

        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete a category by its ID
    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)

            if Material.objects.filter(category=category).exists():
                raise ValidationError(detail="Cannot delete category because it is associated with existing materials.")

            category.delete()
            return Response({'message': 'Category deleted successfully.'}, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            raise NotFound(detail="Category not found.")


# Class-based view for CRUD operations on Material
class MaterialView(APIView):
    permission_classes = [IsAuthenticated]

    # Retrieve all materials
    def get(self, request):
        if request.user.role.name == 'ADMIN':
            materials = Material.objects.all()
        else:
            materials = Material.objects.filter(user=request.user)

        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Create a material
    def post(self, request):
        serializer = MaterialSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update an existing material
    def put(self, request, pk):
        try:
            material = Material.objects.get(pk=pk)
        except Material.DoesNotExist:
            raise NotFound(detail="Material not found.")

        serializer = MaterialSerializer(material, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete a material
    def delete(self, request, pk):
        try:
            material = Material.objects.get(pk=pk)
            material.delete()
            return Response({'message': 'Material deleted successfully.'}, status=status.HTTP_200_OK)
        except Material.DoesNotExist:
            raise NotFound(detail="Material not found.")


# View for updating user profile info
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        allowed_fields = ['first_name', 'last_name', 'username']
        data = {key: value for key, value in request.data.items() if key in allowed_fields}

        for field, value in data.items():
            setattr(user, field, value)

        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuizView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        quizzes = Quiz.objects.filter(user=request.user)
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class QuizDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk, user=request.user)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)

        serializer = QuizSerializer(quiz, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk, user=request.user)
            quiz.delete()
            return Response({'message': 'Quiz deleted successfully.'})
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)


class QuestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=404)

        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
            question.delete()
            return Response({'message': 'Question deleted successfully.'})
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=404)


class DownloadQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk, user=request.user)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)

        serializer = QuizSerializer(quiz)
        json_data = json.dumps(serializer.data, indent=4)

        data_dir = os.path.join(settings.BASE_DIR, 'quiz')
        os.makedirs(data_dir, exist_ok=True)

        file_path = os.path.join(data_dir, f"quiz_{quiz.id}.json")
        with open(file_path, 'w') as f:
            f.write(json_data)

        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))


class ResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        results = Result.objects.filter(user=request.user)
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResultDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            result = Result.objects.get(pk=pk, user=request.user)
        except Result.DoesNotExist:
            return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ResultSerializer(result, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            result = Result.objects.get(pk=pk, user=request.user)
            result.delete()
            return Response({'message': 'Review deleted successfully.'}, status=status.HTTP_200_OK)
        except Result.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)


class DownloadResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            result = Result.objects.get(pk=pk, user=request.user)
        except Result.DoesNotExist:
            return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ResultSerializer(result)
        json_data = json.dumps(serializer.data, indent=4)

        quiz_dir = os.path.join(settings.BASE_DIR, 'quiz')
        os.makedirs(quiz_dir, exist_ok=True)

        file_path = os.path.join(quiz_dir, f"result_{result.id}.json")
        with open(file_path, 'w') as f:
            f.write(json_data)

        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
