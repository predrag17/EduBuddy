# edubuddy/utils.py
import os
from pydantic import BaseModel
from dotenv import load_dotenv
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


def query_rag(query_text: str) -> str:
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

    return generate_response(prompt)


def generate_response(prompt: str) -> str:
    try:
        model = ChatOpenAI(model="gpt-4o", temperature=0.2)
        response = model.invoke([{"role": "system", "content": prompt}])
        return response.content  # Extract the content from the response object
    except Exception as e:
        return f"Error: No valid response. {str(e)}"
