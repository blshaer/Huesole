import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { setAuth } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
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

      <Card className="border-border/40 bg-background/60 z-10 w-full max-w-md overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-500">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
              {status === "loading" && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              )}
              {status === "success" && (
                <Sparkles className="h-8 w-8 animate-pulse text-yellow-500" />
              )}
              {status === "error" && (
                <XCircle className="h-8 w-8 text-red-500 transition-transform active:scale-90" />
              )}
            </div>
            <CardTitle className="text-center text-3xl font-bold tracking-tight">
              {status === "loading"
                ? "Verifying..."
                : status === "success"
                  ? "All Set!"
                  : "Oops!"}
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 text-center text-sm">
              {status === "loading"
                ? "Give us a moment while we validate your account."
                : status === "success"
                  ? "Verification complete. Your journey begins here."
                  : "We couldn't verify your email address."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pb-8 pt-6">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-primary/10 h-2 w-48 overflow-hidden rounded-full">
                <div className="animate-progress h-full w-full origin-left bg-primary" />
              </div>
              <p className="animate-pulse text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Processing
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
              <Alert className="border-green-500/30 bg-green-500/5 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Verification Successful</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button
                onClick={() => navigate("/")}
                className="group h-12 w-full text-base font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="w-full space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
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
        <CardFooter className="bg-muted/5 border-border/40 border-t py-4">
          <p className="text-muted-foreground/60 w-full text-center text-xs">
            Securely powered by GradientsCSS
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
