import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "../app/css/globals.css";
import App from "./App.tsx";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";
import BrandConsole from "./components/status/BrandConsole.tsx";
AOS.init();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <BrandConsole />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
