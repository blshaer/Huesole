import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VerifyDialog from "../features/auth/components/VerifyDialog";
import { useAuth } from "../features/auth/context/AuthContext";

const RegisterPage = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        setGoogleLoading(true);
        try {
          await login(tokenResponse.access_token);
          navigate("/onboarding");
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

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Validation Error", { description: "Passwords do not match. Please ensure both fields are identical." });
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      setIsSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again with different details.";
      toast.error("Registration Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return <VerifyDialog />;
  }

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6">
      {/* Background artistic elements */}
      <div className="absolute right-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
      <div className="bg-primary/10 absolute bottom-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl delay-1000" />

      <Card className="border-border/40 bg-background/60 z-10 w-full max-w-md shadow-2xl backdrop-blur-xl transition-all duration-300">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex flex-col items-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Join thousands of designers and developers using LumeGradients.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={handleRegister} className="grid gap-5">
            <div className="mx-auto">
            <div className="flex justify-center transition-opacity hover:opacity-90">
              {googleLoading ? (
                <Button
                  className="h-11 w-[280px] font-medium"
                  variant="outline"
                  disabled
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting with Google...
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-[280px] rounded-full border-primary/20 bg-background/50 font-medium transition-all hover:bg-background/80"
                  onClick={() => googleLoginTrigger()}
                >
                  <img src="/app/assets/google.svg" alt="Google" className="mr-3 h-5 w-5" />
                  Sign in with Google
                </Button>
              )}
            </div>
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

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              variant="ghost"
              className="mt-2 h-11 w-full bg-white/5 text-base font-semibold backdrop-blur-md border border-white/10 shadow-lg transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
              type="submit"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Join the Community"
              )}
            </Button>

          </form>
        </CardContent>
        <CardFooter className="border-border/40 flex flex-col gap-4 border-t pb-8 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-400 transition-colors hover:text-blue-500"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
