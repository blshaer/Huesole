import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useGoogleLogin } from "@react-oauth/google";
import { RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { resendVerification } from "../features/auth/services/authService";
import { AuthLayout } from "../features/auth/components/AuthLayout";

const LoginPage = () => {
  const { emailLogin, login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showResend, setShowResend] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        setGoogleLoading(true);
        try {
          await login(tokenResponse.access_token);
          navigate("/");
        } catch (error) {
          toast.error("Google Login Failed", { description: "Please try again." });
        } finally {
          setGoogleLoading(false);
        }
      }
    },
    onError: () => {
      toast.error("Google Login Failed", { description: "Please try manually." });
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!identifier || cooldown > 0) return;
    setLoading(true);
    try {
      await resendVerification(identifier);
      toast("Link Sent", { description: "A fresh verification link has been sent to your email." });
      setCooldown(60);
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message || "Failed to resend link." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    try {
      await emailLogin({ identifier, password });
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      if (errorMessage.toLowerCase().includes("verify your email")) {
        setShowResend(true);
      }

      toast.error("Login Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isAnyLoading = loading || googleLoading;

  return (
    <AuthLayout
      title="Welcome Back"
      description="Login to access your saved gradients and account settings."
      showGoogle
      googleLoading={googleLoading}
      onGoogleClick={() => googleLoginTrigger()}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Create a free account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="identifier" className="text-sm font-semibold">
            Username or Email Address
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder="Username or name@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isAnyLoading}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs underline font-medium text-muted-foreground transition-colors hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isAnyLoading}
            required
          />
        </div>

        <Button
          className="mt-2 h-11 w-full bg-blue-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-[0.98]"
          type="submit"
          disabled={isAnyLoading || !identifier || !password}
        >
          {loading && !showResend ? (
            <span className="flex items-center gap-2">
              <Spinner size={20} />
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="px-8 max-md:px-2 text-center max-md:text-left text-[11px] max-md:text-[10px] text-white/45 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline text-white underline-offset-2 hover:text-primary transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline text-white  underline-offset-2 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          .
        </p>


        {showResend && (
          <Button
            type="button"
            variant="outline"
            className="border-primary/20 hover:border-primary/50 w-full gap-2"
            onClick={handleResend}
            disabled={isAnyLoading || cooldown > 0}
          >
            {loading ? (
              <Spinner size={20} />
            ) : (
              <RefreshCw className="h-4 w-4 text-primary" />
            )}
            {cooldown > 0
              ? `Resend link in ${cooldown}s`
              : "Resend Verification Link"}
          </Button>
        )}
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
