# edubuddy/views.py
from django.http import JsonResponse
from django.views import View
import json

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from edubuddy.management.commands.query_data import query_rag


# Class-based view for the chatbot endpoint
@method_decorator(csrf_exempt, name='dispatch')
class ChatbotMessageView(View):
    def post(self, request):
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            message = data.get('message', '')

            # Call your RAG function
            response = query_rag(message)

            return JsonResponse({
                'message': response
            }, status=200)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
