import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useGoogleLogin } from "@react-oauth/google";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VerifyDialog from "../features/auth/components/VerifyDialog";
import { useAuth } from "../features/auth/context/AuthContext";
import { AuthLayout } from "../features/auth/components/AuthLayout";

const RegisterPage = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Validation Error", { description: "Passwords do not match." });
      return;
    }


    try {
      await register({ name, username, email, password });
      toast.success("Account created successfully", { description: "We've sent a verification link to your email." });
      setIsSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error("Registration Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };


  if (isSuccess) {
    return <VerifyDialog />;
  }

  return (
    <AuthLayout
      title="Create Account"
      description="Join thousands of designers and developers using LumeGradients."
      showGoogle
      googleLoading={googleLoading}
      onGoogleClick={() => googleLoginTrigger()}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign In
          </Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="grid gap-5">
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
          <Label htmlFor="username" className="text-sm font-semibold">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
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

 <div className="hidden" />

        <Button
          className="mt-2 h-11 w-full bg-blue-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-[0.98]"
          type="submit"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size={20} />
              Creating Account...
            </span>
          ) : (
            "Join the Community"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;

