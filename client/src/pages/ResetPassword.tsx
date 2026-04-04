import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../features/auth/services/authService";
import { AuthLayout } from "../features/auth/components/AuthLayout";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = "/login";

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [success, navigate, redirectTo]);

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
    <AuthLayout
      title="Reset Password"
      description="Secure your account by entering a new password below."
      footer={
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Login
        </Link>
      }
    >
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
            className="mt-2 h-11 w-full bg-blue-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-[0.98]"
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
    </AuthLayout>
  );
};

export default ResetPassword;

