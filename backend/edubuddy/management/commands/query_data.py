import os
from pydantic import BaseModel
from dotenv import load_dotenv

from django.core.management.base import BaseCommand
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from edubuddy.management.commands.get_embedding_function import get_embedding_function
from langchain_chroma import Chroma

# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the questions **ONLY** related to cybersecurity based on the following context:

{context}

Answer the question based on the above context: {question}
"""


class Request(BaseModel):
    message: str


class ActionResponse(BaseModel):
    response: str


class Command(BaseCommand):
    help = "Query the RAG system with a tutor-related question"

    def add_arguments(self, parser):
        parser.add_argument("query_text", type=str, help="The question to query the RAG system")

    def handle(self, *args, **options):
        query_text = options["query_text"]

        self.stdout.write(f"Querying RAG with: '{query_text}'")

        # Call the query_rag function
        response = self.query_rag(query_text)
        self.stdout.write(f"RAG response: {response}")

    def query_rag(self, query_text: str):
        # Prepare the DB
        embedding_function = get_embedding_function()
        db = Chroma(
            persist_directory=CHROMA_PATH,
            embedding_function=embedding_function,
        )

        # Search the DB
        results = db.similarity_search_with_score(query_text, k=3)

        if not results:
            return "I don't know"

        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])

        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        return self.generate_response(prompt)

    def generate_response(self, prompt):
        try:
            model = ChatOpenAI(model="gpt-4o", temperature=0.2)
            response = model.invoke([{"role": "system", "content": prompt}])
            return response
        except Exception as e:
            return f"Error: No valid response. {str(e)}"
