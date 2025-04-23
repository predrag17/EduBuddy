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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
