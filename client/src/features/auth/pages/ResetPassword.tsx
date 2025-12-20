import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
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
                description: "Passwords do not match. Please ensure both fields are identical.",
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
                description: "Invalid or expired reset token. Please request a new link.",
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
                description: "Your password has been successfully reset. Redirecting to login...",
            });
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Something went wrong while resetting your password.";
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
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />

            <Card className="z-10 w-full max-w-md border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-4 pb-8">
                    <div className="flex flex-col items-center space-y-2">

                        <CardTitle className="text-3xl font-bold tracking-tight text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center text-sm text-white/50 px-4">
                            Secure your account by entering a new password below.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {success ? (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                                <p className="text-green-500 font-medium">Password Reset Successful!</p>
                                <p className="text-sm text-white/60 mt-1">You will be redirected to the login page shortly.</p>
                            </div>
                            <Button className="w-full" asChild>
                                <Link to="/login">Sign In Now</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="password font-semibold text-sm">New Password</Label>
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
                                <Label htmlFor="confirmPassword font-semibold text-sm">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required

                                />
                            </div>
                            <Button type="submit" className="h-11 w-full text-base font-semibold shadow-lg transition-all active:scale-[0.98] mt-2" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating Password...
                                    </span>
                                ) : "Reset Password"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t border-border/40 pt-6">
                    <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Return to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ResetPassword;
