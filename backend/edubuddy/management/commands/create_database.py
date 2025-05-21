import os
import shutil

from django.core.management.base import BaseCommand
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from edubuddy.management.commands.get_embedding_function import get_embedding_function

CHROMA_PATH = "chroma"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
DATA_PATH = os.path.join(BASE_DIR, "data")


class Command(BaseCommand):
    help = "Populate chroma database from folder data"

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Reset the database.")

    def handle(self, *args, **options):
        self.stdout.write("Starting script...")
        self.stdout.write(f"DATA_PATH is: {DATA_PATH}")

        if options["reset"]:
            self.clear_database()
        self.generate_data_store()

    def clear_database(self):
        self.stdout.write("✨ Clearing Database")
        if os.path.exists(CHROMA_PATH):
            shutil.rmtree(CHROMA_PATH)

    def generate_data_store(self):
        documents = self.load_documents()
        chunks = self.split_documents(documents)
        self.save_to_chroma(chunks)

    def load_documents(self):
        try:
            document_loader = PyPDFDirectoryLoader(DATA_PATH)
            documents = document_loader.load()
            self.stdout.write(f"Loaded {len(documents)} documents from {DATA_PATH}")
            return documents
        except Exception as e:
            self.stdout.write(f"Error loading documents: {e}")
            return []

    def split_documents(self, documents: list[Document]):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )
        chunks = text_splitter.split_documents(documents)

        self.stdout.write(f"Split {len(documents)} documents into {len(chunks)} chunks.")
        return chunks

    def save_to_chroma(self, chunks: list[Document]):
        db = Chroma(
            persist_directory=CHROMA_PATH, embedding_function=get_embedding_function()
        )

        chunks_with_ids = self.calculate_chunk_ids(chunks)

        existing_items = db.get(include=[])
        existing_ids = set(existing_items["ids"])
        self.stdout.write(f"Number of existing documents in DB: {len(existing_ids)}")

        new_chunks = []
        for chunk in chunks_with_ids:
            if chunk.metadata["id"] not in existing_ids:
                new_chunks.append(chunk)

        if len(new_chunks):
            self.stdout.write(f"👉 Adding new documents: {len(new_chunks)}")
            new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
            db.add_documents(new_chunks, ids=new_chunk_ids)
        else:
            self.stdout.write("✅ No new documents to add")

    def calculate_chunk_ids(self, chunks):
        last_page_id = None
        current_chunk_index = 0

        for chunk in chunks:
            source = chunk.metadata.get("source")
            page = chunk.metadata.get("page")
            current_page_id = f"{source}:{page}"

            if current_page_id == last_page_id:
                current_chunk_index += 1
            else:
                current_chunk_index = 0

            chunk_id = f"{current_page_id}:{current_chunk_index}"
            last_page_id = current_page_id

            chunk.metadata["id"] = chunk_id

        return chunks
