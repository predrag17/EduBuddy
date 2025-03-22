# EduBuddy

EduBuddy is an innovative web application designed to assist students in analyzing and processing study materials. The platform leverages AI to automatically generate questions and answers like a test, making learning more interactive and efficient. Users can upload presentations, books, or notes (PDF), and the system will analyze the content to create interactive questions, explanations, and personalized recommendations. EduBuddy also acts as a chatbot, serving as a helpful and friendly companion for students. With its conversational interface, EduBuddy feels like a supportive friend who is always ready to assist with study-related queries, provide explanations, and guide students through their learning journey. Whether it's helping with difficult concepts or offering tailored advice, EduBuddy makes studying feel like a more engaging and enjoyable experience. Additionally, it features accessibility options like text-to-speech for students with visual impairments or dyslexia, ensuring everyone can benefit from its educational tools.

## Features

- **AI-Powered Question Generation**: Automatically generates questions and answers from uploaded study materials, providing users with a downloadable test to view the results.
- **PDF Processing with RAG**: Uses Retrieval-Augmented Generation (RAG) to analyze and extract key insights from PDFs.
- **Interactive AI Tutor**: Allows users to interact with an AI tutor as a friendly companion, ask questions, and receive relevant answers.
- **Accessibility Features**:
  - Converts text to speech for students with visual impairments or dyslexia.

## Tech Stack
EduBuddy is built using modern web technologies to ensure scalability, performance, and flexibility.

### Backend:
- **Django Rest Framework**: Facilitates the creation of RESTful APIs, allowing seamless integration with the frontend.
- **PostgreSQL**: Stores user information, study materials metadata, and AI-generated content.
- **LangChain**: Manages AI interactions using Retrieval-Augmented Generation (RAG) to enhance response quality.
- **ChromaDB**: A vector database used for storing and retrieving PDF embeddings efficiently.

### Frontend:
- **React with TypeScript**: A powerful library and typing system for building an interactive and type-safe user interface.

### AI and Processing:
- **LangChain**: Implements AI-driven document analysis and question generation.
- **ChromaDB**: Stores vector embeddings for efficient search and retrieval of PDF content.
- **Text-to-Speech**: Enables accessibility features like speech synthesis and text simplification.

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- Python 3.9+
- Node.js 16+
- PostgreSQL

### Environment Variables
Create a `.env` file in the `backend` and `frontend` directories and add necessary environment variables (e.g., database credentials, API keys).

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/edubuddy.git
cd edubuddy/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the Next.js development server
npm start
```

EduBuddy aims to revolutionize learning by making study materials more interactive and accessible for everyone.

