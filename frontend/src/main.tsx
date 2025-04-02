import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Providers } from "./components/provider.tsx";
import Home from "./components/home-layout.tsx";
import ChatbotPage from "./pages/chatbot/chatbot-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
