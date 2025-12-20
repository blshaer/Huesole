import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resendVerification } from "../services/authService";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { AlertCircle, CheckCircle2, Mail, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "@/shared/hooks/use-toast";

const RegisterPage = () => {
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
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

    const handleResendLink = async () => {
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Validation Error",
                description: "Passwords do not match. Please ensure both fields are identical.",
                variant: "destructive",
            });
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
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again with different details.";
            toast({
                title: "Registration Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-[90vh] items-center justify-center p-6 text-center">
                <Card className="w-full max-w-md border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-500">
                    <CardHeader className="space-y-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                            <Mail className="h-10 w-10 text-green-500 animate-bounce" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Verify Your Email</CardTitle>
                        <CardDescription className="text-base text-muted-foreground/90">
                            We've sent a verification link to your inbox. Please click the link to activate your account and start creating gradients.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <Alert className="border-green-500/30 bg-green-500/5 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Check your email (and spam folder) for the confirmation link.</AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t border-border/40 pt-6">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleResendLink}
                            disabled={loading || cooldown > 0}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Link"}
                        </Button>
                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6">
            {/* Background artistic elements */}
            <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse delay-1000" />

            <Card className="z-10 w-full max-w-md border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-4 pb-8">
                    <div className="flex flex-col items-center space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
                        <CardDescription className="text-center text-sm text-muted-foreground">
                            Join thousands of designers and developers using GradientsCSS.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">

                    <form onSubmit={handleRegister} className="grid gap-5">
                        <div className="mx-auto">
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
                                <span className="bg-background px-2 text-white/60 glass-morphism">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
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
                            <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
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
                        <Button className="h-11 w-full text-base font-semibold shadow-lg transition-all  mt-2" type="submit" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating Account...
                                </span>
                            ) : "Join the Community"}
                        </Button>
                    </form>



                </CardContent>
                <CardFooter className="flex flex-col gap-4 pb-8 border-t border-border/40 pt-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="font-bold text-blue-400 hover:text-blue-500 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;
