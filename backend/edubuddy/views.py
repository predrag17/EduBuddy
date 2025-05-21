import io
import os
import wave

import pdfplumber
import re

from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from openai import OpenAI, AsyncOpenAI

from django.core.management import call_command
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse
from dotenv import load_dotenv

from pdf2image import convert_from_path
from pytesseract import pytesseract
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from knox.models import AuthToken

from backend import settings
from .models import EduBuddyUser, Material, Quiz, Question, Category, Answer, QuizResult, QuestionResult, ChatMessage, \
    Conversation

from .serializers import UserSerializer, MaterialSerializer, QuizSerializer, \
    CategorySerializer, QuizResultSummarySerializer, ConversationSerializer, ChatMessageSerializer

from edubuddy.management.commands.query_data import query_rag

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

openai = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def generate_audio_stream(text: str, instructions: str = None):
    wav_buffer = io.BytesIO()
    wav_file = wave.open(wav_buffer, 'wb')

    sample_rate = 24000
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)

    wav_file.writeframes(b'')

    wav_buffer.seek(0)
    header = wav_buffer.getvalue()
    wav_buffer.close()

    yield header

    async with openai.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice="alloy",
            input=text,
            instructions=instructions or "",
            response_format="pcm"
    ) as response:
        async for chunk in response.iter_bytes(1024):
            yield chunk


class TextToSpeechView(APIView):
    def post(self, request):
        text = request.data.get("text")
        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        audio_stream = generate_audio_stream(text)

        return StreamingHttpResponse(
            audio_stream,
            content_type="audio/wav",
            headers={"Content-Disposition": "inline; filename=tts.wav"}
        )


class ChatbotMessageView(APIView):
    def post(self, request):
        try:
            message = request.data.get('message')
            conversation_id = request.data.get('conversation_id')
            user = request.user

            if user is not None and not isinstance(user, AnonymousUser) and user.is_authenticated:
                if conversation_id:
                    conversation = Conversation.objects.get(id=conversation_id, user=user)
                else:
                    conversation = Conversation.objects.create(user=user)
                    conversation.title = f"Conversation - {conversation.id}"
                    conversation.save()

                ChatMessage.objects.create(
                    conversation=conversation,
                    sender='user',
                    message=message
                )

            response = query_rag(message)

            if user is not None and not isinstance(user, AnonymousUser) and user.is_authenticated:
                bot_message = ChatMessage.objects.create(
                    conversation=conversation,
                    sender='bot',
                    message=response
                )
                serialized_message = ChatMessageSerializer(bot_message)
                return Response({'message': serialized_message.data}, status=status.HTTP_200_OK)

            return Response({
                'message': {
                    'sender': 'bot',
                    'message': response
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConversationListView(APIView):
    def get(self, request):
        conversations = Conversation.objects.filter(user=request.user).order_by('-created_at')

        serialized_conversations = ConversationSerializer(conversations, many=True)

        return Response(serialized_conversations.data, status=status.HTTP_200_OK)


class ChatMessagesView(APIView):
    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            messages = conversation.messages.order_by('timestamp')
            serializer = ChatMessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"error": "Conversation not found or access denied."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return JsonResponse(
                {"error": "An unexpected error occurred.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            AuthToken.objects.filter(user=request.user).delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise NotFound(detail="Category not found.")

        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)

            if Material.objects.filter(category=category).exists():
                raise ValidationError(detail="Cannot delete category because it is associated with existing materials.")

            category.delete()
            return Response({'message': 'Category deleted successfully.'}, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            raise NotFound(detail="Category not found.")


class MaterialView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        if request.user.role.name == 'ADMIN':
            materials = Material.objects.all()
        else:
            materials = Material.objects.filter(user=request.user)

        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    def delete(self, request, material_id):
        try:
            material = Material.objects.get(pk=material_id)

            if material.file and os.path.isfile(material.file.path):
                os.remove(material.file.path)

            material.delete()

            call_command("create_database", reset=True)

            return Response({
                'message': 'Material deleted successfully.',
            }, status=status.HTTP_200_OK)

        except Material.DoesNotExist:
            raise NotFound(detail="Material not found.")
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

        font_path = os.path.join(settings.BASE_DIR, 'fonts', 'DejaVuSans.ttf')
        pdfmetrics.registerFont(TTFont('DejaVu', font_path))
        bold_font_path = os.path.join(settings.BASE_DIR, 'fonts', 'DejaVuSans-Bold.ttf')
        pdfmetrics.registerFont(TTFont('DejaVu-Bold', bold_font_path))

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("DejaVu-Bold", 11)
        p.drawString(100, height - 50, f"Quiz Title: {quiz.title}")
        p.drawString(100, height - 70, f"User: {user.username}")
        p.drawString(100, height - 90, f"Score: {correct} / {total}")
        p.drawString(100, height - 120, "Results:")

        p.setFont("DejaVu", 10)
        y_position = height - 140

        max_width = 400

        def draw_wrapped_text(p, text, x, y, font_name, font_size, max_width):
            lines = simpleSplit(text, font_name, font_size, max_width)
            for line in lines:
                p.drawString(x, y, line)
                y -= font_size + 2
            return y

        for row in result_rows:
            question_text = f"Question: {row[0]}"
            selected_answer = f"Your Answer: {row[1]}"
            correct_answer = f"Correct Answer: {row[2]}"
            result = f"Result: {row[3]}"

            for content in [question_text, selected_answer, correct_answer, result]:
                y_position = draw_wrapped_text(p, content, 100, y_position, "DejaVu", 10, max_width)

            y_position -= 20

            if y_position < 50:
                p.showPage()
                p.setFont("DejaVu", 10)
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
