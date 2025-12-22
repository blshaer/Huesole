import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import { useToast } from "@/shared/hooks/use-toast";
import { Separator } from "@/shared/ui/separator";
import {
  User,
  ShieldCheck,
  KeyRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Mail,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Camera,
  Pencil,
  Save as SaveIcon,
} from "lucide-react";
import axios from "axios";

interface PasswordStrength {
  strength: "weak" | "medium" | "strong";
  score: number;
}

const ProfilePage = () => {
  const { user, token, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data state
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loadingState, setLoadingState] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: "weak",
    score: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      setName(user.name);
      setPreviewUrl(user.picture || "");
    }
  }, [user, loading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsEditingProfile(true); // Automatically enter edit mode on file selection
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };


  // Password strength calculator
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength({ strength: "weak", score: 0 });
      return;
    }

    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (newPassword.length >= 12) score += 25;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score += 25;
    if (/\d/.test(newPassword)) score += 15;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score += 10;

    const strength: "weak" | "medium" | "strong" =
      score < 40 ? "weak" : score < 75 ? "medium" : "strong";

    setPasswordStrength({ strength, score });
  }, [newPassword]);

  // Auto-dismiss success message (Removed as we use Toasts now)

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-base font-medium text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) {
        formData.append("picture", selectedFile);
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      if (response.data.user) {
        updateUser(response.data.user);
      }
      setIsEditingProfile(false);
      setSelectedFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match. Please ensure both fields are identical.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long for security.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength.strength === "weak") {
      toast({
        title: "Error",
        description: "Please choose a stronger password with a mix of uppercase, lowercase, numbers, and symbols.",
        variant: "destructive",
      });
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
        },
      );
      toast({
        title: "Success",
        description: "Password updated successfully! Your account is now more secure.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "Unable to update password. Please verify your current password is correct.",
        variant: "destructive",
      });
    } finally {
      setLoadingState(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.strength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getMemberSinceDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="to-muted/20 relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background px-4 py-8 md:px-6 md:py-12">
      {/* Enhanced ambient background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/8 absolute right-0 top-0 h-[500px] w-[500px] animate-pulse rounded-full blur-[120px]" />
        <div className="bg-blue-500/6 absolute bottom-0 left-0 h-[400px] w-[400px] animate-pulse rounded-full blur-[100px] delay-1000" />
        <div className="bg-purple-500/4 absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl">


        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* User Profile Card */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="from-primary/20 via-primary/10 h-24 bg-gradient-to-br to-transparent" />

              <CardHeader className="-mt-20 flex flex-col items-center pb-4">
                <div className="relative mb-4 h-40 w-40">
                  <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-2xl" />
                  <Avatar
                    className="relative z-10 h-40 w-40 border-4 border-background shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group/avatar"
                    onClick={triggerFileSelect}
                  >
                    <AvatarImage src={getFullImageUrl(previewUrl)} alt={user.name} />
                    <AvatarFallback
                      className="bg-cover bg-center text-4xl font-bold text-white"
                      style={{
                        backgroundImage:
                          'url("https://vercel.com/api/www/avatar/SA7kRQYuUGOPuPmxWAQycgXZ")',
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={triggerFileSelect}
                    className="absolute bottom-1 right-1 z-30 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-white shadow-lg transition-transform hover:scale-110"
                    title="Change Profile Picture"
                  >
                    <Camera className="h-5 w-5" />
                  </button>

                  {selectedFile && (
                    <Button
                      size="sm"
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-40 gap-2 shadow-xl animate-in zoom-in-50"
                      onClick={handleUpdateProfile}
                      disabled={profileLoading}
                    >
                      {profileLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <SaveIcon className="h-3 w-3" />
                      )}
                      Save Avatar
                    </Button>
                  )}

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="absolute bottom-2 left-2 z-20 h-6 w-6 rounded-full border-4 border-background bg-green-500 shadow-lg">
                    <span className="sr-only">Active</span>
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {user.email || "No email provided"}
                  </CardDescription>
                </div>
              </CardHeader>

              <Separator className="my-4" />

              <CardContent className="space-y-4 flex justify-center items-center text-center  pb-6">
                <div className="bg-muted/40 hover:bg-muted/60 flex items-center justify-center gap-3 rounded-lg p-3 transition-colors">

                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Member Since
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {getMemberSinceDate()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Settings Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* General Settings Card */}
            <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl">General Information</CardTitle>
                  <CardDescription>
                    Update your public profile information
                  </CardDescription>
                </div>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    className="h-8 gap-2"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditingProfile || profileLoading}
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={profileLoading}
                        className="gap-2"
                      >
                        {profileLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SaveIcon className="h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setName(user.name);
                          setPreviewUrl(user.picture || "");
                          setSelectedFile(null);
                          setIsEditingProfile(false);
                          setError("");
                        }}
                        disabled={profileLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Password Change Card */}
            <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl">Change Password</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Keep your account secure with a strong password
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-semibold"
                      >
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-semibold"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Minimum 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {newPassword.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Password strength
                            </span>
                            <span
                              className={`font-semibold capitalize ${passwordStrength.strength === "strong"
                                ? "text-green-600"
                                : passwordStrength.strength === "medium"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                                }`}
                            >
                              {passwordStrength.strength}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${passwordStrength.score}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="h-11 w-full px-8 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] sm:w-auto"
                      disabled={loadingState}
                    >
                      {loadingState ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating Password...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Update Password
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
