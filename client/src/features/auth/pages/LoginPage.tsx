import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resendVerification } from "../services/authService";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "@/shared/hooks/use-toast";

const LoginPage = () => {
  const { emailLogin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showResend, setShowResend] = useState(false);

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
    if (!email || cooldown > 0) return;
    setLoading(true);
    try {
      await resendVerification(email);
      toast({
        title: "Link Sent",
        description: "A fresh verification link has been sent to your email.",
      });
      setCooldown(60);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to resend link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailLogin({ email, password });
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      if (errorMessage.toLowerCase().includes("verify your email")) {
        setShowResend(true);
      }

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6">
      {/* Background elements for depth */}
      <div className="bg-primary/10 absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-700" />

      <Card className="border-border/40 bg-background/60 z-10 w-full max-w-md shadow-2xl backdrop-blur-xl transition-all duration-300">
        <CardHeader className="flex flex-col items-center space-y-4 pb-8">
          <div className="flex flex-col items-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-sm text-white/50">
              Login to access your saved gradients and account settings.
            </CardDescription>
          </div>

          <div className="flex justify-center transition-opacity hover:opacity-90">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  setLoading(true);
                  try {
                    await login(credentialResponse.credential);
                    navigate("/");
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              onError={() => {
                toast({
                  title: "Google Login Failed",
                  description: "Please try manually.",
                  variant: "destructive",
                });
              }}
              theme="outline"
              shape="circle"
              text="signin_with"
              width="280px"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="glass-morphism bg-background px-2 text-white/60">
                or continue with
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={handleLogin} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary hover:underline"
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
                required
              />
            </div>
            <Button
              className="h-11 w-full text-base font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading && !showResend ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            {showResend && (
              <Button
                type="button"
                variant="outline"
                className="border-primary/20 hover:border-primary/50 w-full gap-2"
                onClick={handleResend}
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-primary" />
                )}
                {cooldown > 0
                  ? `Resend link in ${cooldown}s`
                  : "Resend Verification Link"}
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="border-border/40 flex flex-col gap-4 border-t pb-8 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-400 transition-colors hover:text-blue-500"
            >
              Create a free account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
