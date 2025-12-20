import "animate.css";
import "../app/css/globals.css";
import AppRoutes from "@/shared/routes/__routes";
import { inject } from "@vercel/analytics";
import { Toaster } from "@/shared/ui/toaster";
import GridBackground from "@/shared/ui/GridBackground";
import Support from "./features/landing/components/Support";

const App: React.FC = () => {
  inject();

  return (
    <div
      dir="ltr"
      className="App relative min-h-screen overflow-x-hidden pb-[30px]"
    >
      <Support />
      <GridBackground />
      <Toaster />
      <AppRoutes />
    </div>
  );
};

export default App;
