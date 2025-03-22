# EduBuddy

Welcome to EduBuddy, platform where you can meet your best friend for studying!

## Overview

EduBuddy is an innovative web application designed to assist students in analyzing and processing study materials. The platform leverages AI to automatically generate questions and answers like a test, making learning more interactive and efficient. Users can upload presentations, books, or notes (PDF), and the system will analyze the content to create interactive questions, explanations, and personalized recommendations. EduBuddy also acts as a chatbot, serving as a helpful and friendly companion for students. With its conversational interface, EduBuddy feels like a supportive friend who is always ready to assist with study-related queries, provide explanations, and guide students through their learning journey. Whether it's helping with difficult concepts or offering tailored advice, EduBuddy makes studying feel like a more engaging and enjoyable experience. Additionally, it features accessibility options like text-to-speech for students with visual impairments or dyslexia, ensuring everyone can benefit from its educational tools.

---

## User Roles

EduBuddy will have two types of users:

1. **Regular User**:
    - College Students
    - Middle School and Elementary School Students
2. **Admin User**

---

## Features

1. **User Authentication & Authorization (User, Admin)**: Securely register and log in to access your personalized study materials and EduBuddy-chatbot.
2. **Interactive AI Tutor Powered by RAG (User, Admin)**: Engage with an AI-driven tutor that analyzes PDFs, extracts key insights, and provides relevant answers to enhance your learning experience.
3. **Question Generation (User, Admin)**: Automatically generates questions from uploaded study materials, providing users with a downloadable test to view the results.
4. **Uploading materials for learning (User, Admin)**: Upload study materials (PDFs) to build a comprehensive knowledge base, enabling the AI to provide more accurate and contextually relevant answers.
5. **Manage and View Learning Materials (Admin)**: Effortlessly access, update, or delete study materials to maintain an accurate and refined knowledge base, and prevent uploading irrelevant content, ensuring the AI provides the most relevant and up-to-date answers.
6. **View and Manage My Uploaded Materials (User, Admin)**: Easily view, manage, update, or delete your uploaded study materials to keep your knowledge base structured and up to date.
7. **EduBuddy-Powered Text-to-Speech (User, Admin)**: Convert study materials into natural-sounding audio, allowing you to listen and learn on the go.

---

## Pages and Functionalities

1. **Home Page:**
- Overview of the platform and its features.
- Option to browse and access interactive AI tutor and study materials.
- Display of recent activities, including the latest uploaded materials and question generation results.

2. **Interactive AI Tutor Page:**
- Engage with the AI-driven tutor that analyzes PDFs, extracts key insights, and provides answers.
- Options to interact with EduBuddy-chatbot for personalized learning assistance.

3. **Question Generation Page:**
- Automatically generates questions from uploaded study materials.
- Users can download a test based on the questions and view the results.

4. **Upload Materials Page:**
- Allows users to upload study materials (PDFs) to build a knowledge base.
- Option for both users and admins to upload relevant content for enhanced AI responses.

5. **Manage and View Materials Page (Admin):**
- Admin users can view, manage, update, or delete study materials.
- Prevent irrelevant content uploads to maintain a refined knowledge base for accurate answers.

6. **My Materials Page (User, Admin):**
- Displays the uploaded study materials of the logged-in user or admin.
- Options to easily manage, update, or delete personal materials and keep the knowledge base up to date.

7. **EduBuddy-Powered Text-to-Speech Page:**
- Convert uploaded study materials into audio format for listening on the go.
- Available for both users and admins to utilize the text-to-speech functionality.

8. **Login Page:**
- For users who already have an account to securely log in and access their study materials.
- Users can also access the registration page if they haven't created an account yet.

9. **Register Page:**
- For new users to create an account and gain access to personalized study tools and resources.

---

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

---

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

