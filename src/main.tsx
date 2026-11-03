import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import "./styles/app.css";
import App from "./App.tsx";

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

console.log(
  "%cHuesole%c  free CSS gradients",
  "color:#667eea;font-weight:700;font-size:16px;",
  "color:#94a3b8;font-weight:500;font-size:12px;",
);

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
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
