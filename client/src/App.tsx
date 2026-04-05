import React from "react";
import "animate.css";
import "./css/globals.css";
import { Toaster } from "@/shared/ui/sonner";
import AppRoutes from "@/shared/routes/__routes";
import { TooltipProvider } from "@/shared/ui/tooltip";
import GridBackground from "@/shared/ui/GridBackground";
import Support from "./features/landing/components/Support";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./features/auth/context/AuthContext";
import { Navbar } from "./features/navbar/components/Navbar";
import Footer from "./features/footer/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import BannedScreen from "./features/auth/components/BannedScreen";
import { CookieConsent } from "@/shared/ui/CookieConsent";

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { banInfo, user, token, isLoading } = useAuth();

  React.useEffect(() => {
    if (user && token && !isLoading && !user.username && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [user, token, isLoading, location.pathname, navigate]);

  // Hide navbar and footer on AI Generator and Admin pages
  const isAIGeneratorPage = location.pathname === "/ai-generator";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isErrorPreviewPage = location.pathname === "/error-preview";
  const hideGlobalElements = isAIGeneratorPage || isAdminPage || isErrorPreviewPage;

  if (banInfo?.isBanned) {
    return <BannedScreen />;
  }

  return (
    <div
      dir="ltr"
      className={`App relative min-h-screen `}
    >
      <CookieConsent />
      {!hideGlobalElements && <Navbar showAngleController={false} />}
      {!hideGlobalElements && <Support />}
      {!hideGlobalElements && <GridBackground />}
      <Toaster position="bottom-right" richColors />
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
