import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";

import { toast } from "@/shared/hooks/use-toast";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description:
          "Passwords do not match. Please ensure both fields are identical.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Error",
        description:
          "Invalid or expired reset token. Please request a new link.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(password, token);
      setSuccess(true);
      toast({
        title: "Success",
        description:
          "Your password has been successfully reset. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong while resetting your password.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6">
      {/* Background elements */}
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
          {success ? (
            <div className="space-y-6 duration-500 animate-in fade-in zoom-in">
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center">
                <p className="font-medium text-green-500">
                  Password Reset Successful!
                </p>
                <p className="mt-1 text-sm text-white/60">
                  You will be redirected to the login page shortly.
                </p>
              </div>
              <Button className="w-full" asChild>
                <Link to="/login">Sign In Now</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="password font-semibold text-sm">
                  New Password
                </Label>
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
                <Label htmlFor="confirmPassword font-semibold text-sm">
                  Confirm New Password
                </Label>
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
                type="submit"
                className="mt-2 h-11 w-full text-base font-semibold shadow-lg transition-all active:scale-[0.98]"
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
