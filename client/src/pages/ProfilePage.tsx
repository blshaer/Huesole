import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Switch } from "@/shared/ui/switch";
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import { cn } from "@/shared/lib/utils";
import axios from "@/shared/lib/axios";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Pencil,
  Trash2,
  XCircle,
  Save as SaveIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

interface PasswordStrength {
  strength: "weak" | "medium" | "strong";
  score: number;
}

interface UpdateProfileResponse {
  user: {
    name: string;
    email?: string;
    picture?: string;
  };
}


const DEFAULT_AVATARS = [
  "https://api.dicebear.com/9.x/glass/svg?seed=Felix",
  "https://api.dicebear.com/9.x/glass/svg?seed=Nala",
  "https://api.dicebear.com/9.x/glass/svg?seed=Milo",
  "https://api.dicebear.com/9.x/glass/svg?seed=Luna",
  "https://api.dicebear.com/9.x/glass/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/glass/svg?seed=Shadow",
  "https://api.dicebear.com/9.x/glass/svg?seed=Coco",
  "https://api.dicebear.com/9.x/glass/svg?seed=Pepper",
  "https://api.dicebear.com/9.x/glass/svg?seed=Willow",
  "https://api.dicebear.com/9.x/glass/svg?seed=Jasper",
  "https://api.dicebear.com/9.x/glass/svg?seed=Bear",
  "https://api.dicebear.com/9.x/glass/svg?seed=Daisy",
];


const ProfilePage = () => {
  const { user, isLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedSuggestedAvatar, setSelectedSuggestedAvatar] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingState, setLoadingState] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: "weak",
    score: 0,
  });

  // Privacy & Consent
  const [isCookieAccepted, setIsCookieAccepted] = useState(() => {
    return localStorage.getItem("cookie-consent") === "accepted";
  });

  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => {
    return isCookieAccepted && localStorage.getItem("privacy-analytics") === "true";
  });
  const [sessionRecording, setSessionRecording] = useState(() => {
    return isCookieAccepted && localStorage.getItem("privacy-sessions") === "true";
  });
  const [personalizedAds, setPersonalizedAds] = useState(() => {
    return isCookieAccepted && localStorage.getItem("privacy-ads") === "true";
  });

  // Sync with localStorage when toggled
  useEffect(() => {
    localStorage.setItem("privacy-analytics", analyticsEnabled.toString());
  }, [analyticsEnabled]);

  useEffect(() => {
    localStorage.setItem("privacy-sessions", sessionRecording.toString());
  }, [sessionRecording]);

  useEffect(() => {
    localStorage.setItem("privacy-ads", personalizedAds.toString());
  }, [personalizedAds]);

  // Listen for consent acceptance to auto-enable
  useEffect(() => {
    const handleStorageChange = () => {
      const consent = localStorage.getItem("cookie-consent");
      const accepted = consent === "accepted";
      setIsCookieAccepted(accepted);
      
      if (accepted) {
        setAnalyticsEnabled(true);
        setSessionRecording(true);
        setPersonalizedAds(true);
      } else {
        setAnalyticsEnabled(false);
        setSessionRecording(false);
        setPersonalizedAds(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also check on mount in case it just changed
    handleStorageChange();

    // Custom event for same-window updates
    window.addEventListener("cookie-consent-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookie-consent-updated", handleStorageChange);
    };
  }, []);


  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user) {
      setName(user.name);
      setUsername(user.username || "");
      setPreviewUrl(user.picture || "");
    }
  }, [user, isLoading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", { description: "Please upload a JPG, PNG, or WebP image." });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", { description: "Maximum file size is 5MB." });
        return;
      }

      setSelectedFile(file);
      setSelectedSuggestedAvatar(null);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditingProfile(true);
    }
  };



  const handleSuggestedAvatarSelect = (avatarUrl: string) => {
    setSelectedSuggestedAvatar(avatarUrl);
    setSelectedFile(null);
    setPreviewUrl(avatarUrl);
    setIsEditingProfile(true);
  };



  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

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

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={64} className="text-primary" />
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
      toast.error("Error", { description: "Display name cannot be empty." });
      return;
    }

    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (username.trim()) formData.append("username", username.trim());
      if (selectedFile) {
        formData.append("picture", selectedFile);
      } else if (selectedSuggestedAvatar) {
        formData.append("picture", selectedSuggestedAvatar);
      }

      const response = await axios.put<UpdateProfileResponse>(
        "/auth/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast("Success", { description: "Profile updated successfully!" });

      if (response.data.user) updateUser(response.data.user);
      setIsEditingProfile(false);
      setSelectedFile(null);
      setSelectedSuggestedAvatar(null);
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message ||
          "Unable to update profile. Please try again." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Error", { description: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 8 || passwordStrength.strength === "weak") {
      toast.error("Error", { description: "Please choose a stronger password." });
      return;
    }

    setLoadingState(true);
    try {
      await axios.put(
        "/auth/updatepassword",
        { currentPassword, newPassword }
      );
      toast("Success", { description: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message || "Unable to update password." });
    } finally {
      setLoadingState(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;

    setDeleteLoading(true);
    try {
      await axios.delete("/auth/delete-account");
      toast("Account deleted", { description: "Your account has been permanently deleted." });
      logout();
      navigate("/");
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message || "Unable to delete account." });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
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
    if (user.createdAt) {
      return new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="to-muted/20 relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background px-4 py-8 md:px-6 md:py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/8 absolute right-0 top-0 h-[500px] w-[500px] animate-pulse rounded-full blur-[120px]" />
        <div className="bg-blue-500/6 absolute bottom-0 left-0 h-[400px] w-[400px] animate-pulse rounded-full blur-[100px] delay-1000" />
        <div className="bg-purple-500/4 absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="from-primary/20 via-primary/10 h-24 bg-gradient-to-br to-transparent" />
              <CardHeader className="-mt-20 flex flex-col items-center pb-4">
                <div className="relative mb-4 h-40 w-40">
                  <div className="bg-primary/20 absolute inset-0 rounded-full blur-2xl" />
                  <Avatar
                    className="relative z-10 h-40 w-40 border-4 border-background bg-muted text-white shadow-2xl transition-transform hover:scale-[1.02] cursor-pointer"
                    onClick={triggerFileSelect}
                  >
                    <AvatarImage
                      src={getFullImageUrl(previewUrl)}
                      alt={user.name}
                    />
                    <AvatarFallback
                      className="bg-gradient-to-br from-[#92A1C6] via-[#146A7C] to-[#C271B4] text-white text-4xl font-bold uppercase transition-all"
                    >
                      {user.name && user.name.split(" ").length > 1
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                        : user.name?.slice(0, 2) || "UA"}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute bottom-0 right-0 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary border border-border hover:bg-primary/20 shadow-sm transition-all hover:scale-110"
                    onClick={triggerFileSelect}
                  >
                    <Pencil className="h-4 w-4" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  JPG, PNG or WebP. Max 5MB. 256×256
                </p>

                <div className="space-y-1 text-center mt-2">
                  <CardTitle className="text-2xl font-bold">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {user.email || "No email provided"}
                  </CardDescription>
                  {/* Email Verification Status */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {user.isVerified !== false ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-400">
                        <XCircle className="h-3 w-3" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <Separator className="my-4" />

              <CardContent className="flex items-center justify-center space-y-4 pb-6 text-center">
                <div className="bg-muted/40 flex items-center justify-center gap-3 rounded-lg p-3">
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

          <div className="space-y-6 lg:col-span-2">
            {/* General Information */}
            <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4 max-md:flex-col max-md:pt-0">
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
                    className="h-8 gap-2 max-md:w-full"
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
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                        disabled={!isEditingProfile || profileLoading}
                        placeholder="your_username"
                        maxLength={30}
                      />
                      <p className="text-[10px] text-muted-foreground opacity-70">
                        Lowercase letters, numbers, dots, hyphens, and underscores only.
                      </p>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="space-y-4 pt-4">
                      <Label className="text-sm font-semibold">Or Pick a Suggested Avatar</Label>
                      <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
                        {DEFAULT_AVATARS.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => handleSuggestedAvatarSelect(avatar)}
                            className={`relative rounded-lg p-0.5 transition-all ${
                              selectedSuggestedAvatar === avatar
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                                : "hover:scale-110 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={avatar} alt="Avatar option" />
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isEditingProfile && (
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={profileLoading}
                        className="gap-2"
                      >
                        {profileLoading ? (
                          <Spinner size={20} />
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
                          setUsername(user.username || "");
                          setPreviewUrl(user.picture || "");
                          setSelectedFile(null);
                          setSelectedSuggestedAvatar(null);
                          setIsEditingProfile(false);
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
              <CardHeader className="space-y-3 max-md:pt-0">
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
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div className="space-y-4">
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
                      <AnimatePresence>
                        {newPassword.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2 pt-1 overflow-hidden"
                          >
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
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength.score}%` }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

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

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="h-11 w-full px-8 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] sm:w-auto"
                      disabled={loadingState || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      {loadingState ? (
                        <span className="flex items-center gap-2">
                          <Spinner size={20} />
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

            {/* Privacy & Consent */}
            <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <CardHeader className="max-md:pt-0">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl">Privacy & Consent</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Manage your data privacy and cookie preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className={cn(
                  "flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-white/[0.02] p-4 transition-all",
                  !isCookieAccepted && "opacity-50 grayscale pointer-events-none"
                )}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Usage Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      Help us improve by allowing anonymous usage analytics
                    </p>
                  </div>
                  <Switch
                    checked={analyticsEnabled}
                    onCheckedChange={setAnalyticsEnabled}
                    disabled={!isCookieAccepted}
                  />
                </div>

                <div className={cn(
                  "flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-white/[0.02] p-4 transition-all",
                  !isCookieAccepted && "opacity-50 grayscale pointer-events-none"
                )}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Session Recordings</p>
                    <p className="text-xs text-muted-foreground">
                      Anonymized session recordings to help us fix issues
                    </p>
                  </div>
                  <Switch
                    checked={sessionRecording}
                    onCheckedChange={setSessionRecording}
                    disabled={!isCookieAccepted}
                  />
                </div>

                <div className={cn(
                  "flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-white/[0.02] p-4 transition-all",
                  !isCookieAccepted && "opacity-50 grayscale pointer-events-none"
                )}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Personalized Ads</p>
                    <p className="text-xs text-muted-foreground">
                      Allow personalized ads and marketing content
                    </p>
                  </div>
                  <Switch
                    checked={personalizedAds}
                    onCheckedChange={setPersonalizedAds}
                    disabled={!isCookieAccepted}
                  />
                </div>

                {!isCookieAccepted && (
                  <p className="text-xs text-amber-500/80 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 text-center animate-pulse">
                    Please accept cookies to manage privacy preferences.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500/20 bg-card/50 overflow-hidden shadow-2xl backdrop-blur-xl">
              <CardHeader className="max-md:pt-0">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Irreversible actions for your account
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-red-400">Delete Account</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Once you delete your account, there is no going back. All your data including gradients and favorites will be permanently removed.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 shrink-0"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete Account
                    </Button>
                  </div>

                  {showDeleteConfirm && (
                    <div className="mt-4 space-y-3 border-t border-red-500/10 pt-4">
                      <p className="text-xs text-red-400">
                        To confirm, type <span className="font-bold">DELETE</span> below:
                      </p>
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="border-red-500/20 focus-visible:ring-red-500/30"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteConfirmText !== "DELETE" || deleteLoading}
                          onClick={handleDeleteAccount}
                        >
                          {deleteLoading ? (
                            <Spinner size={20} className="mr-1.5" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          Permanently Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
