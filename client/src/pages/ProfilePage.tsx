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
import { Switch } from "@/shared/ui/switch";
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import { cn } from "@/shared/lib/utils";
import axios from "@/shared/lib/axios";
import {
  CheckCircle2,
  LogOut,
  XCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";


interface UpdateProfileResponse {
  user: {
    name: string;
    email?: string;
    picture?: string;
  };
}


const ProfilePage = () => {
  const { user, isLoading, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedSuggestedAvatar, setSelectedSuggestedAvatar] = useState<string | null>(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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
      if (!selectedFile && !selectedSuggestedAvatar) {
        setPreviewUrl(user.picture || "");
      }
    }
  }, [user, isLoading, navigate]);

  const hasProfileChanges =
    name !== (user?.name || "") ||
    username !== (user?.username || "") ||
    selectedFile !== null ||
    selectedSuggestedAvatar !== null;

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
    }
  };



  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

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
      setSelectedFile(null);
      setSelectedSuggestedAvatar(null);
    } catch (err: any) {
      toast.error("Error", {
        description: err.response?.data?.message ||
          "Unable to update profile. Please try again."
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Removed Change Password method

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

  // Removed getPasswordStrengthColor

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
    <div className="min-h-screen bg-background text-foreground px-4 py-8 md:px-8 md:py-12">
      <div className="container mx-auto max-md:px-0 max-w-[1120px]">
        <div className="grid md:grid-cols-[200px_1fr] gap-8 lg:gap-16">
          {/* Sidebar Navigation */}
          <aside className="max-md:hidden h-fit sticky top-32 z-20">
            <nav className="flex flex-col  gap-1 w-[200px] ">
              {[
                { id: "profile", label: "Profile" },
                { id: "account", label: "Account" },
                { id: "privacy", label: "Privacy" },
                { id: "danger-zone", label: "Danger Zone" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 outline-none text-white/45 hover:text-white hover:bg-muted/30"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">

              <svg
                id="Layer_2"
                data-name="Layer 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 108.89 108.89"
                className="w-8 h-8 shrink-0"
              >
                <g id="Layer_1-2" data-name="Layer 1">
                  <path
                    fill="white"
                    d="M61.16,0l7.32,20.58,19.72-9.38q4.74,4.74,9.49,9.49l-9.38,19.72,20.58,7.32v13.42l-20.58,7.32,9.38,19.72q-4.74,4.74-9.49,9.49l-19.72-9.38-7.32,20.58h-13.42l-7.32-20.58-19.72,9.38q-4.74-4.74-9.49-9.49l9.38-19.72L0,61.16v-13.42l20.58-7.32-9.38-19.72q4.74-4.74,9.49-9.49l19.72,9.38L47.74,0h13.42Z"
                  />
                </g>
              </svg>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-white/50 mt-1">Manage your account settings and preferences</p>
              </div>
            </div>

            {/* PROFILE CARD */}
            <Card id="profile" className="scroll-mt-24 border shadow-sm">
              <CardHeader className="pb-6 flex flex-col items-start  px-6 pt-6">
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription className="text-sm mt-1 text-white/45">Update your profile information and avatar</CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-6 pt-0 space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border border-border">
                    <AvatarImage src={previewUrl && previewUrl !== "no-photo.jpg" ? getFullImageUrl(previewUrl) : undefined} alt={user.name} />
                    <AvatarFallback className="text-xl bg-white/10 text-white">
                      {user.name && user.name.split(" ").length > 1
                        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                        : user.name?.slice(0, 2) || "UA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.webp" className="hidden" />
                    <Button variant="outline" size="sm" onClick={triggerFileSelect} className="h-9 transition-all">
                      Change avatar
                    </Button>
                    <p className="text-xs text-white/45 mt-2">JPG, PNG or WebP. Max 5MB.<br /><span className="font-mono">256x256</span></p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
                      <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                      <Input id="username" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))} className="w-full h-10" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 max-md:pt-0">
                    <Button type="submit" disabled={profileLoading || !hasProfileChanges} className="h-9 px-4 shrink-0 transition-all font-medium py-2 bg-[#F8F8F8] text-black hover:bg-[#E5E5E5] disabled:opacity-50">
                      {profileLoading ? <Spinner size={16} className="mr-2 border-black" /> : null}
                      Save changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* ACCOUNT CARD */}
            <Card id="account" className="scroll-mt-24 border shadow-sm">
              <CardHeader className="pb-6 px-6 pt-6  flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Account</CardTitle>
                  <CardDescription className="text-sm mt-1 text-white/45">Manage your account settings</CardDescription>
                </div>
                <Button size="sm" onClick={() => { logout(); navigate("/"); }} className="gap-2 px-4 h-9 bg-[#761618] text-white hover:bg-[#761618]/90 border-0 font-medium transition-all">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </CardHeader>
              <CardContent className="px-6 py-6 pt-0 space-y-8">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Account Created</p>
                  <p className="text-sm text-white/45">{getMemberSinceDate()}</p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Email Verification</p>
                    <p className="text-xs text-white/45">{user.email || "No email"}</p>
                  </div>
                  {user.isVerified ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-amber-500">
                      <XCircle className="h-4 w-4" />
                      Not Verified
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* PRIVACY CARD */}
            <Card id="privacy" className="scroll-mt-24 border shadow-sm">
              <CardHeader className="pb-6 flex flex-col items-start   px-6 pt-6">
                <CardTitle className="text-lg">Privacy & Consent</CardTitle>
                <CardDescription className="text-sm mt-1 text-white/45">Manage your data privacy and cookie preferences</CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-6 space-y-4">
                <div className={cn("flex items-center justify-between gap-4 rounded-lg border p-4 transition-all", !isCookieAccepted && "opacity-50 grayscale pointer-events-none")}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Analytics</p>
                    <p className="text-xs text-muted-foreground">Help us improve by allowing anonymous usage analytics</p>
                  </div>
                  <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} disabled={!isCookieAccepted} />
                </div>
                <div className={cn("flex items-center justify-between gap-4 rounded-lg border p-4 transition-all", !isCookieAccepted && "opacity-50 grayscale pointer-events-none")}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Session Replay</p>
                    <p className="text-xs text-muted-foreground">Anonymized session recordings to help us fix issues</p>
                  </div>
                  <Switch checked={sessionRecording} onCheckedChange={setSessionRecording} disabled={!isCookieAccepted} />
                </div>
                <div className={cn("flex items-center justify-between gap-4 rounded-lg border p-4 transition-all", !isCookieAccepted && "opacity-50 grayscale pointer-events-none")}>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Marketing</p>
                    <p className="text-xs text-muted-foreground">Allow personalized ads and marketing content</p>
                  </div>
                  <Switch checked={personalizedAds} onCheckedChange={setPersonalizedAds} disabled={!isCookieAccepted} />
                </div>
                {!isCookieAccepted && (
                  <button 
                    onClick={() => window.dispatchEvent(new Event("open-cookie-consent"))}
                    className="w-full text-xs text-amber-500/80 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 text-center hover:bg-amber-500/10 transition-colors cursor-pointer"
                  >
                    Please accept cookies to manage privacy preferences.
                  </button>
                )}
              </CardContent>
            </Card>

            {/* DANGER ZONE CARD */}
            <Card id="danger-zone" className="scroll-mt-24 border border-[#761618] shadow-sm">
              <CardHeader className="pb-6 flex flex-col items-start px-6 pt-6">
                <CardTitle className="text-lg">Danger Zone</CardTitle>
                <CardDescription className="text-sm mt-1 text-white/45">Irreversible actions for your account</CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-6 border">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete account</p>
                    <p className="text-xs text-white/45 mt-1 max-w-[400px]">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="outline" className="h-9 shrink-0 bg-[#761618] text-white hover:bg-[#761618]/90 border-0 font-medium transition-all" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>
                    Delete account
                  </Button>
                </div>

                {showDeleteConfirm && (
                  <div className="mt-6 space-y-3 border-t border-red-500/10 pt-6">
                    <p className="text-xs text-red-400">
                      To confirm, type <span className="font-bold">DELETE</span> below:
                    </p>
                    <div className="flex items-center gap-3">
                      <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE to confirm" className="max-w-xs border-red-500/20 focus-visible:ring-red-500/30 h-9" />
                      <Button size="sm" disabled={deleteConfirmText !== "DELETE" || deleteLoading} onClick={handleDeleteAccount} className="h-9 bg-[#761618] text-white hover:bg-[#761618]/90 border-0 font-medium transition-all">
                        {deleteLoading ? <Spinner size={16} className="mr-1.5" /> : null}
                        Permanently Delete
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }} className="h-9">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
