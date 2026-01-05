import { useToast } from "@/shared/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { API_URL } from "@/shared/config";
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
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import axios from "axios";
import {
  AlertCircle,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Save as SaveIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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


const ProfilePage = () => {
  const { user, token, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user) {
      setName(user.name);
      setPreviewUrl(user.picture || "");
    }
  }, [user, isLoading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditingProfile(true);
    }
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
      if (selectedFile) formData.append("picture", selectedFile);

      const response = await axios.put<UpdateProfileResponse>(
        `${API_URL}/auth/update-profile`,
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

      if (response.data.user) updateUser(response.data.user);
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

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8 || passwordStrength.strength === "weak") {
      toast({
        title: "Error",
        description: "Please choose a stronger password.",
        variant: "destructive",
      });
      return;
    }

    setLoadingState(true);
    try {
      await axios.put(
        `${API_URL}/auth/updatepassword`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast({
        title: "Success",
        description: "Password updated successfully!",
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
          err.response?.data?.message || "Unable to update password.",
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

  const getMemberSinceDate = () =>
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

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
                    className="relative z-10 h-40 w-40 border-4 border-background shadow-2xl"
                    onClick={triggerFileSelect}
                  >
                    <AvatarImage
                      src={getFullImageUrl(previewUrl)}
                      alt={user.name}
                    />
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
                  <Camera
                    className="absolute bottom-1 right-1 z-30 h-6 w-6 cursor-pointer text-primary"
                    onClick={triggerFileSelect}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
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

            {/* Password Change Card (unchanged) */}
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
