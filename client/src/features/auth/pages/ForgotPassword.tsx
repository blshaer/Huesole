import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { toast } from "@/shared/hooks/use-toast";
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email address.",
                variant: "destructive",
            });
            return;
        }

        if (cooldown > 0) return;

        setLoading(true);
        try {
            await forgotPassword(email);
            toast({
                title: "Link Sent",
                description: "If an account exists for this email, we've sent a password reset link.",
            });
            setCooldown(60);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                "Failed to send reset email. Please try again later.";
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
            {/* Background elements for depth */}
            <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-700" />

            <Card className="z-10 w-full max-w-md border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-4 pb-8 flex flex-col items-center text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight">Forgot Password</CardTitle>
                        <CardDescription className="text-center text-sm text-white/50 px-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <form onSubmit={handleSubmit} className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            className="h-11 w-full text-base font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
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
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pb-8 border-t border-border/40 pt-6">
                    <Link
                        to="/login"
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPassword;
