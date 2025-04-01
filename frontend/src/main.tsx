import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Providers } from "./components/provider.tsx";
import Home from "./home.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
