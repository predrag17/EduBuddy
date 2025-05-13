# edubuddy/serializers.py

from rest_framework import serializers
from .models import EduBuddyUser, Role, Material, Quiz, Question, Category, Answer, QuizResult, QuestionResult, \
    Conversation, ChatMessage


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


class ConversationSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    title = serializers.CharField(max_length=255, required=False)

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'created_at', 'title']


class ChatMessageSerializer(serializers.ModelSerializer):
    conversation = ConversationSerializer()
    sender = serializers.CharField(max_length=10)
    message = serializers.CharField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'conversation', 'sender', 'message', 'timestamp']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class MaterialSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = Material
        fields = ['id', 'subject', 'description', 'file', 'is_processed', 'category', 'category_id', 'uploaded_at',
                  'user']
        extra_kwargs = {
            'file': {'required': True},
            'user': {'read_only': True},
        }

    def validate_file(self, value):
        if not value.name.endswith(('.pdf')):
            raise serializers.ValidationError("File type is not supported. Please upload a PDF file.")
        return value


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "difficulty", "answers"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']


class QuestionResultSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField(source='question.id')
    selected_answer = serializers.CharField()
    difficulty = serializers.CharField(source='question.difficulty')

    class Meta:
        model = QuestionResult
        fields = ['question_id', 'selected_answer', 'difficulty']


class QuizResultSummarySerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='quiz.title')
    question_results = QuestionResultSerializer(many=True)
    difficulty = serializers.SerializerMethodField()

    class Meta:
        model = QuizResult
        fields = ['id', 'quiz_id', 'title', 'difficulty', 'score', 'total_questions', 'submitted_at',
                  'question_results']

    def get_difficulty(self, obj):
        first_question_result = obj.question_results.first()
        if first_question_result:
            return first_question_result.question.difficulty
        return ""
