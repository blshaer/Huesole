import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../features/auth/services/authService";
import { AuthLayout } from "../features/auth/components/AuthLayout";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier) {
      toast.error("Error", { description: "Please enter your email or username." });
      return;
    }

    if (cooldown > 0) return;


    setLoading(true);
    try {
      await forgotPassword(identifier);
      toast("Link Sent", { description: "If an account exists for this entry, we've sent a link." });
      setCooldown(60);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to send reset email. Please try again later.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email or username and we'll send a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="identifier" className="text-sm font-semibold">
              Username or Email
            </Label>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </div>
          <Input
            id="identifier"
            type="text"
            placeholder="Username or name@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>


        <Button
          className="mt-2 h-11 w-full bg-blue-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-[0.98]"
          type="submit"
          disabled={loading || cooldown > 0}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Link...
            </span>
          ) : cooldown > 0 ? (
            <span className="flex items-center gap-2">
              Resend in {cooldown}s
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Reset Link
            </span>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;

