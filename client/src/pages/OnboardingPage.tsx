import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { toast } from "sonner";
import axios from "@/shared/lib/axios";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Loader2, RefreshCw, Check, Sparkles } from "lucide-react";

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

/**
 * Generate username suggestions based on a display name.
 */
const generateUsernameSuggestions = (name: string): string[] => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

  if (!base) return [];

  const suffixes = [
    Math.floor(Math.random() * 999),
    Math.floor(Math.random() * 99),
    `_${Math.floor(Math.random() * 99)}`,
    `.${Math.floor(Math.random() * 999)}`,
  ];

  return [
    base,
    ...suffixes.map((s) => `${base}${s}`),
  ].slice(0, 4);
};

const OnboardingPage = () => {
  const { user, updateUser, token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(() =>
    user?.name ? generateUsernameSuggestions(user.name) : [],
  );

  const refreshSuggestions = useCallback(() => {
    if (user?.name) {
      setSuggestions(generateUsernameSuggestions(user.name));
    }
  }, [user?.name]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    setUsername(value);
    setUsernameError("");
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setUsernameError("Please choose a username");
      return;
    }

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      if (selectedAvatar) {
        formData.append("name", user?.name || "");
      }

      const response = await axios.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.user) {
        updateUser(response.data.user);
      }

      toast("Welcome aboard!", {
        description: `Your username @${username} has been set.`,
      });

      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.message?.includes("taken")) {
        setUsernameError("This username is already taken. Try another.");
      } else {
        toast.error("Error", {
          description: err.response?.data?.message || "Something went wrong.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  useEffect(() => {
    if (user && (user as any).username) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || !token) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Let's set up your profile to get started
          </p>
        </div>

        {/* Username Section */}
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-xl">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">
              Choose a Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="your_username"
              maxLength={30}
              className="h-12 text-base"
            />
            {usernameError && (
              <p className="text-xs text-destructive">{usernameError}</p>
            )}
            <p className="text-[10px] text-muted-foreground">
              Lowercase letters, numbers, dots, hyphens, and underscores only.
            </p>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Suggestions
                </span>
                <button
                  onClick={refreshSuggestions}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setUsername(s);
                      setUsernameError("");
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      username === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    @{s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar Section */}
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-xl">
          <Label className="text-sm font-semibold">Pick an Avatar</Label>
          <div className="grid grid-cols-6 gap-3">
            {DEFAULT_AVATARS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative rounded-xl p-1 transition-all ${
                  selectedAvatar === avatar
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatar} alt="Avatar option" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                {selectedAvatar === avatar && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-12 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Continue
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
