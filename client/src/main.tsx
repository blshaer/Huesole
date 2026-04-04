import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./css/globals.css";
import App from "./App.tsx";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";
import LumeGradients from "./shared/components/LumeGradients.tsx";
AOS.init();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <LumeGradients />
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
