import io
import json
import os

import pdfplumber
import re

from openai import OpenAI

from django.core.management import call_command
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from dotenv import load_dotenv

from pdf2image import convert_from_path
from pytesseract import pytesseract

from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from knox.models import AuthToken

from .models import EduBuddyUser, Material, Quiz, Question, Category, Answer, QuizResult, QuestionResult

from .serializers import UserSerializer, MaterialSerializer, QuizSerializer, \
    CategorySerializer, QuizResultSummarySerializer

from edubuddy.management.commands.query_data import query_rag

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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
    parser_classes = (MultiPartParser, FormParser)

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
            material = serializer.save(user=request.user)

            try:
                call_command("create_database")

                material.is_processed = True
                material.save(update_fields=["is_processed"])
            except Exception as e:
                print(f"Failed to execute create_database command: {e}")

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


class MaterialDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            material = Material.objects.get(pk=pk)
        except Material.DoesNotExist:
            raise NotFound(detail="Material not found.")

        if request.user.role.name != 'ADMIN' and material.user != request.user:
            raise PermissionDenied("You do not have permission to view this material.")

        serializer = MaterialSerializer(material)
        return Response(serializer.data, status=status.HTTP_200_OK)


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


class GenerateQuestionsView(APIView):
    def post(self, request):
        difficulty = request.data.get('difficulty')
        material_id = request.data.get('material_id')
        if not difficulty or not material_id:
            return Response(
                {"error": "Difficulty and material are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_difficulties = [choice[0] for choice in Question.DIFFICULTY_LEVELS]
        if difficulty not in valid_difficulties:
            return Response(
                {"error": "Invalid difficulty level"},
                status=status.HTTP_400_BAD_REQUEST
            )

        material = get_object_or_404(Material, id=material_id)

        try:
            pdf_path = material.file.path
            pdf_text = self.extract_pdf_text(pdf_path)
            if not pdf_text:
                return Response(
                    {"error": "No text could be extracted from the PDF"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"error": f"Error processing PDF: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        quiz = Quiz.objects.create(
            title=f"Quiz for {material.file}",
            description=f"Generated quiz for material {material.file} with {difficulty} difficulty",
            user=request.user
        )

        try:
            questions_data = self.generate_questions_with_ai(pdf_text, difficulty)
        except Exception as e:
            quiz.delete()
            return Response(
                {"error": f"Error generating questions: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        for q_data in questions_data:
            question = Question.objects.create(
                quiz=quiz,
                text=q_data["text"],
                difficulty=difficulty
            )
            for ans_data in q_data["answers"]:
                Answer.objects.create(
                    question=question,
                    text=ans_data["text"],
                    is_correct=ans_data["is_correct"]
                )

        serializer = QuizSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def extract_pdf_text(self, pdf_path):
        """Extract text from a PDF file."""
        text = ""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

            if not text.strip():
                print("No text found with pdfplumber. Falling back to OCR...")
                images = convert_from_path(pdf_path)
                for image in images:
                    page_text = pytesseract.image_to_string(image)
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def generate_questions_with_ai(self, pdf_text, difficulty):
        """
        Generate multiple questions using OpenAI's GPT model based on text and difficulty.
        Automatically detects the language of the input text if needed.
        Returns a list of question dictionaries with answers.
        """
        max_text_length = 4000
        truncated_text = pdf_text[:max_text_length]

        if difficulty == "easy":
            question_types = ["basic comprehension", "definition", "simple fact"]
            num_answers = 3
            default_num_questions = 5
        elif difficulty == "medium":
            question_types = ["application", "comparison", "cause-effect"]
            num_answers = 4
            default_num_questions = 10
        else:
            question_types = ["analysis", "synthesis", "critical thinking"]
            num_answers = 4
            default_num_questions = 15

        prompt = (
            f"You are an expert teacher creating questions.\n"
            f"Based on the following text:\n\n"
            f"{truncated_text}\n\n"
            f"Generate {default_num_questions} multiple-choice questions of the following types: "
            f"{', '.join(question_types)}.\n"
            f"For each question:\n"
            f"- Provide exactly {num_answers} answer choices, labeled A, B, C, etc.\n"
            f"- Mark the correct answer clearly (e.g., 'Correct answer: B').\n"
            f"- Format each question as follows:\n"
            f"  Question <number>: <question text>\n"
            f"  A. <answer text>\n"
            f"  B. <answer text>\n"
            f"  ... \n"
            f"  Correct answer: <letter>\n"
            f"Separate questions with a blank line.\n"
            f"Ensure the response strictly follows the specified format with no additional text.\n"
        )
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=3000
            )
            result = response.choices[0].message.content
            questions_data = []
            print(result)

            question_blocks = re.split(r"\n\s*\n", result.strip())
            for block in question_blocks:
                lines = block.strip().split("\n")
                if not lines or not lines[0].startswith("Question"):
                    print("Skipping invalid block:", block)
                    continue

                question_text = lines[0].replace(re.match(r"Question \d+:", lines[0]).group(0), "").strip()
                answers = []
                temporary_answers = []
                correct_letter = None

                for line in lines[1:]:
                    line = line.strip()
                    if line.lower().startswith("correct answer"):
                        correct_letter = line.split(":")[-1].strip().upper()
                    elif re.match(r"[A-D]\.", line):
                        parts = line.split(".", 1)
                        if len(parts) == 2:
                            letter = parts[0].strip().upper()
                            text = parts[1].strip()
                            temporary_answers.append({
                                "text": text,
                                "letter": letter,
                            })

                for temporary_answer in temporary_answers:
                    is_correct = temporary_answer['letter'] == correct_letter if correct_letter else False
                    answers.append({
                        "text": temporary_answer['text'],
                        "is_correct": is_correct
                    })

                if question_text and len(answers) == num_answers and correct_letter:
                    questions_data.append({
                        "text": question_text,
                        "difficulty": difficulty,
                        "answers": answers
                    })
                else:
                    print("Skipping question due to invalid data:", {
                        "question_text": question_text,
                        "num_answers": len(answers),
                        "correct_letter": correct_letter
                    })

            if not questions_data:
                raise Exception("No valid questions parsed from OpenAI response")

            return questions_data

        except Exception as e:
            raise Exception(f"Error generating questions with OpenAI: {str(e)}")


class DownloadQuizResultView(APIView):
    def post(self, request, quiz_id):
        user = request.user

        try:
            quiz = Quiz.objects.get(id=quiz_id, user=user)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            quiz_result = QuizResult.objects.get(quiz=quiz, user=user)
        except QuizResult.DoesNotExist:
            return Response({"detail": "Quiz result not found."}, status=status.HTTP_404_NOT_FOUND)

        question_results = quiz_result.question_results.all()

        correct = quiz_result.score
        total = quiz_result.total_questions
        result_rows = []

        for question_result in question_results:
            question_text = question_result.question.text
            selected_answer = question_result.selected_answer
            correct_answer = next((a for a in question_result.question.answers.all() if a.is_correct), None).text
            result = "True" if question_result.is_correct else "False"

            result_rows.append([question_text, selected_answer, correct_answer, result])

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica", 12)
        p.drawString(100, height - 50, f"Quiz Title: {quiz.title}")
        p.drawString(100, height - 70, f"User: {user.username}")
        p.drawString(100, height - 90, f"Score: {correct} / {total}")
        p.drawString(100, height - 120, "Results:")

        p.setFont("Helvetica", 10)
        y_position = height - 140

        for row in result_rows:
            question_text = row[0]
            selected_answer = row[1]
            correct_answer = row[2]
            result = row[3]

            p.drawString(100, y_position, f"Question: {question_text}")
            y_position -= 20
            p.drawString(100, y_position, f"Your Answer: {selected_answer}")
            y_position -= 20
            p.drawString(100, y_position, f"Correct Answer: {correct_answer}")
            y_position -= 20
            p.drawString(100, y_position, f"Result: {result}")
            y_position -= 40

            if y_position < 50:
                p.showPage()
                p.setFont("Helvetica", 10)
                y_position = height - 50

        p.showPage()
        p.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="quiz_result_{quiz.title}.pdf"'
        return response


class QuizResultSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        results = QuizResult.objects.filter(user=request.user).select_related('quiz')
        serializer = QuizResultSummarySerializer(results, many=True)
        return Response(serializer.data)


class SaveQuizResultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        quiz_id = request.data.get('quiz_id')
        question_results = request.data.get('question_results')
        score = request.data.get('score')
        user = request.user

        if not quiz_id or not question_results or score is None:
            raise ValidationError("Quiz ID, Question Results, and Score are required.")

        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            raise ValidationError("Quiz not found.")

        quiz_result = QuizResult.objects.create(
            quiz=quiz,
            score=score,
            total_questions=len(question_results),
            user_id=user.id
        )

        question_result_instances = []
        for result in question_results:
            try:
                question = Question.objects.get(id=result['question_id'])
            except Question.DoesNotExist:
                raise ValidationError(f"Question with ID {result['question_id']} not found.")

            try:
                correct_answer = question.answers.get(is_correct=True)
            except Answer.DoesNotExist:
                raise ValidationError(f"No correct answer found for question ID {result['question_id']}.")

            is_correct = result['selected_answer'] == correct_answer.text

            question_result_instances.append(
                QuestionResult(
                    quiz_result=quiz_result,
                    question=question,
                    selected_answer=result['selected_answer'],
                    is_correct=is_correct
                )
            )

        QuestionResult.objects.bulk_create(question_result_instances)

        quiz_result_summary = QuizResultSummarySerializer(quiz_result)

        return Response(quiz_result_summary.data, status=status.HTTP_201_CREATED)
