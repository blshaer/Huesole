import "animate.css";
import "../app/css/globals.css";
import AppRoutes from "@/shared/routes/__routes";
import { inject } from "@vercel/analytics";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/toaster";
import GridBackground from "@/shared/ui/GridBackground";
import Support from "./features/landing/components/Support";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { Navbar } from "./features/navbar/components/Navbar";
import Footer from "./features/footer/components/Footer";
import { useLocation } from "react-router-dom";

const App: React.FC = () => {
  inject();
  const location = useLocation();

  // Hide navbar and footer on AI Generator page (navbar is inside the page component)
  const isAIGeneratorPage = location.pathname === "/ai-generator";

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <TooltipProvider>
          <div
            dir="ltr"
            className={`App relative ${isAIGeneratorPage ? "h-screen overflow-hidden" : "min-h-screen overflow-x-hidden pb-[30px]"}`}
          >
            {!isAIGeneratorPage && <Navbar showAngleController={false} />}
            {!isAIGeneratorPage && <Support />}
            {!isAIGeneratorPage && <GridBackground />}
            <Toaster />
            <AppRoutes />
            {!isAIGeneratorPage && <Footer />}
          </div>
        </TooltipProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
