import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home-layout.tsx";
import ChatbotPage from "./pages/chatbot/chatbot-page.tsx";
import Register from "./pages/auth/register/register.tsx";
import Login from "./pages/auth/login/login.tsx";
import Profile from "./pages/profile/profile.tsx";
import { Providers } from "./components/provider.tsx";
import ViewMaterial from "./pages/material/view-material.tsx";
import ProtectedRoute from "./components/providers/protected-routes.tsx";
import UploadMaterialPage from "./pages/material/components/upload-material-page.tsx";
import Quiz from "./pages/quiz/quiz.tsx";
import StartQuizPage from "./pages/quiz/components/start-quiz-page.tsx";
import ViewQuizzesPage from "./pages/quiz/components/view-quizzes-page.tsx";
import MaterialView from "./pages/material/material-view.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/materials"
            element={<ProtectedRoute element={<ViewMaterial />} />}
          />
          <Route
            path="/material/upload"
            element={<ProtectedRoute element={<UploadMaterialPage />} />}
          />
          <Route path="/quiz" element={<ProtectedRoute element={<Quiz />} />} />
          <Route
            path="/start-quiz"
            element={<ProtectedRoute element={<StartQuizPage />} />}
          />
          <Route
            path="/quizzes"
            element={<ProtectedRoute element={<ViewQuizzesPage />} />}
          />
          <Route
            path="/material/:material_id"
            element={<ProtectedRoute element={<MaterialView />} />}
          />
        </Routes>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
