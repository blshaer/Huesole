import "animate.css";
import "../app/css/globals.css";
import AppRoutes from "@/shared/routes/__routes";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/toaster";
import GridBackground from "@/shared/ui/GridBackground";
import Support from "./features/landing/components/Support";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./features/auth/context/AuthContext";
import { Navbar } from "./features/navbar/components/Navbar";
import Footer from "./features/footer/components/Footer";
import { useLocation } from "react-router-dom";
import BannedScreen from "./features/auth/components/BannedScreen";

const AppContent: React.FC = () => {
  const location = useLocation();
  const { banInfo } = useAuth();

  // Hide navbar and footer on AI Generator and Admin pages
  const isAIGeneratorPage = location.pathname === "/ai-generator";
  const isAdminPage = location.pathname.startsWith("/admin");
  const hideGlobalElements = isAIGeneratorPage || isAdminPage;

  if (banInfo?.isBanned) {
    return <BannedScreen />;
  }

  return (
    <div
      dir="ltr"
      className={`App relative ${isAIGeneratorPage ? "h-screen overflow-hidden" : "min-h-screen overflow-x-hidden pb-[30px]"}`}
    >
      {!hideGlobalElements && <Navbar showAngleController={false} />}
      {!hideGlobalElements && <Support />}
      {!hideGlobalElements && <GridBackground />}
      <Toaster />
      <AppRoutes />
      {!isAIGeneratorPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
