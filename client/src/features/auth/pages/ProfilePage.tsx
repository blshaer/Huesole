import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { User, ShieldCheck, KeyRound, Loader2, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import axios from "axios";

const ProfilePage = () => {
    const { user, token, loading } = useAuth();
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loadingState, setLoadingState] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("The new passwords you entered do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Your new password must be at least 6 characters long.");
            return;
        }

        setLoadingState(true);
        try {
            await axios.put(
                "http://localhost:5000/api/auth/updatepassword",
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess("Your password has been updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update password. Please check your current password.");
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div className="relative min-h-[90vh] py-12 px-6 overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="container relative z-10 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Account Settings
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your personal information and security preferences.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* User Summary Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-xl">
                            <CardHeader className="text-center pb-2">
                                <div className="relative mx-auto w-24 h-24 mb-4">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
                                    <Avatar className="mx-auto h-24 w-24 border-2 border-background shadow-inner relative z-10">
                                        <AvatarImage src={user.picture} alt={user.name} />
                                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-background shadow-sm" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                <CardDescription className="flex items-center justify-center gap-1.5 mt-1">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Verified Account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4 border-t border-border/40">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="p-2 rounded-lg bg-muted/50">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Member Since</p>
                                        <p className="font-medium text-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-semibold">Active Contributor</p>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6 flex justify-center">
                                <Button variant="outline" className="w-full mx-6 h-9 text-xs" disabled>
                                    Edit Basic Info
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Security Settings Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-border/40 bg-background/60 backdrop-blur-xl shadow-xl overflow-hidden">
                            <div className="h-2 w-full bg-gradient-to-r from-primary/40 via-blue-500/40 to-primary/40" />
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    <KeyRound className="h-5 w-5 text-primary" />
                                    <CardTitle>Security & Password</CardTitle>
                                </div>
                                <CardDescription>
                                    Update your password regularly to maintain high account security.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {error && (
                                    <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert className="border-green-500/30 bg-green-500/5 text-green-600 animate-in fade-in slide-in-from-top-1">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <AlertTitle>Success</AlertTitle>
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="sm:col-span-2 space-y-2">
                                            <Label htmlFor="currentPassword font-semibold">Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                placeholder="Enter current password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword font-semibold">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="Min. 6 characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required

                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword font-semibold">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Re-type new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required

                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button type="submit" className="h-11 min-w-[160px] font-semibold shadow-lg transition-all active:scale-[0.98]" disabled={loadingState}>
                                            {loadingState ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Updating...
                                                </span>
                                            ) : "Update Password"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card className="border-border/40 bg-background/40 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        Personal Data
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-4">You can download an archive of your data at any time.</p>
                                    <Button variant="ghost" size="sm" className="w-full text-xs font-semibold h-8" disabled>
                                        Download Data
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="border-red-500/10 bg-red-500/[0.02] backdrop-blur-sm">
                                <CardHeader className="pb-3 text-red-600 dark:text-red-400">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Danger Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground/80 mb-4">Permanently delete your account and all saved gradients.</p>
                                    <Button variant="ghost" size="sm" className="w-full text-xs font-semibold h-8 text-red-600 hover:bg-red-500/10 hover:text-red-600 transition-colors" disabled>
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
