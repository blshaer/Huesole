import { Button } from "@/shared/ui/button";
import {
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { verifyEmail } from "../features/auth/services/authService";
import { AuthLayout } from "../features/auth/components/AuthLayout";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { setAuth } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (!token || hasVerified.current) return;
      hasVerified.current = true;

      try {
        const data = await verifyEmail(token);
        setAuth(data);
        setStatus("success");

        // Navigate immediately without delay
        navigate("/onboarding", { replace: true });
      } catch (err: any) {
        setStatus("error");
      }
    };

    verify();
  }, [token, setAuth, navigate]);

  return (
    <AuthLayout
      title={
        status === "loading"
          ? "Verifying..."
          : status === "success"
            ? "Redirecting..."
            : "Oops!"
      }
      description={
        status === "loading"
          ? "Give us a moment while we validate your account."
          : status === "success"
            ? "Your email has been verified. Taking you to setup..."
            : "We couldn't verify your email address."
      }
    >
      <div className="flex flex-col items-center space-y-6 text-white/60">
        {status === "success" && (
          <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-center font-medium">Start exploring and creating gradients</p>
            <Button
              onClick={() => navigate("/onboarding")}
              className="w-full bg-white/5 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:text-white"
            >
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/login")}
                className="h-11 w-full bg-white/5 font-semibold backdrop-blur-md border border-white/10 transition-all hover:bg-white/10"
              >
                Return to Login
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="h-11 w-full font-medium text-muted-foreground"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;

