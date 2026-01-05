import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { verifyEmail } from "../features/auth/services/authService";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { setAuth } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [, setMessage] = useState("");
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (!token || hasVerified.current) return;
      hasVerified.current = true;

      try {
        const data = await verifyEmail(token);
        // Auto-login using the token returned from verifyEmail
        setAuth(data);
        setStatus("success");
        setMessage(
          "Welcome! Your email has been verified and you've been logged in automatically.",
        );

        // Automatically redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
          "Verification failed. The link may have expired.",
        );
      }
    };

    verify();
  }, [token, setAuth, navigate]);

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6">
      {/* Background sparkle effect */}
      <div className="from-primary/5 absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-50" />

      <Card className="border">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col items-center space-y-2">
            <CardTitle className="text-center text-3xl font-bold tracking-tight">
              {status === "loading"
                ? "Verifying..."
                : status === "success"
                  ? "All Set!"
                  : "Oops!"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-8 pt-6 text-white/60">
          {status === "loading"
            ? "Give us a moment while we validate your account."
            : status === "success"
              ? "Verification complete. Your journey begins here."
              : "We couldn't verify your email address."}

          {status === "success" && (
            <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
              <div>Start explore and creating gradients</div>
              <Button
                onClick={() => navigate("/")}
                className="w-full text-white hover:text-white"
              >
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-white/60">Erorr</div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/login")}
                  className="h-11 w-full font-semibold"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
