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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../features/auth/services/authService";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // After reset, send user to login (safe route that exists in your router)
  const redirectTo = "/login";

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [success, navigate, redirectTo]); // cleanup pattern is recommended for timers [web:101]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match. Please ensure both fields are identical.",
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset token. Please request a new link.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(password, token);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Something went wrong while resetting your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6">
      <div className="bg-primary/5 absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 animate-pulse rounded-full blur-3xl" />

      <Card className="border-border/40 bg-background/60 z-10 w-full max-w-md shadow-2xl backdrop-blur-xl transition-all duration-300">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex flex-col items-center space-y-2">
            <CardTitle className="text-center text-3xl font-bold tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription className="px-4 text-center text-sm text-white/50">
              Secure your account by entering a new password below.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* FIX: show success block when success === true (ternary rendering) [web:1] */}
          {success ? (
            <div className="space-y-6 duration-500 animate-in fade-in zoom-in">
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center">
                <p className="font-medium text-green-500">
                  Password Reset Successful!
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Redirecting to login...
                </p>
              </div>

              <Button className="w-full" asChild>
                <Link to={redirectTo}>Go Now</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full bg-white/5 text-base font-semibold backdrop-blur-md border border-white/10 shadow-lg transition-all hover:bg-white/10 active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="border-border/40 flex justify-center border-t pt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
