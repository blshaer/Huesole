import React from "react";
import "animate.css";
import { Toaster } from "@/components/Toaster";
import AppRoutes from "@/routes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/layout/Navbar";
import Footer from "@/layout/Footer";

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <div dir="ltr" className="App relative min-h-screen">
        <Navbar />
        <Toaster position="bottom-right" />
        <AppRoutes />
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default App;
