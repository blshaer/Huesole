import "animate.css";
import "../app/css/globals.css";
import AppRoutes from "@/shared/routes/__routes";
import { inject } from "@vercel/analytics";
import { Toaster } from "@/shared/ui/toaster";
import GridBackground from "@/shared/ui/GridBackground";
import Support from "./features/landing/components/Support";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { Navbar } from "./features/navbar/components/Navbar";
import Footer from "./features/footer/components/Footer";

const App: React.FC = () => {
  inject();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <div
          dir="ltr"
          className="App relative min-h-screen overflow-x-hidden pb-[30px]"
        >
          <Navbar />
          <Support />
          <GridBackground />
          <Toaster />
          <AppRoutes />
          <Footer />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
