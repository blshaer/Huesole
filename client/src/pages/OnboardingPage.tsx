import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/shared/lib/axios";
import { useAuth } from "@/features/auth/context/AuthContext";
import { RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

// shadcn UI imports
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";

const generateUsernameSuggestions = (name: string): string[] => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
  if (!base) return [];

  const suffixes = [
    Math.floor(Math.random() * 999),
    Math.floor(Math.random() * 99),
    `_${Math.floor(Math.random() * 99)}`,
    `.${Math.floor(Math.random() * 999)}`,
  ];

  return [base, ...suffixes.map((s) => `${base}${s}`)].slice(0, 4);
};

const OnboardingPage = () => {
  const { user, updateUser, token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [name, setName] = useState(user?.name || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(() =>
    user?.name ? generateUsernameSuggestions(user.name) : []
  );

  useEffect(() => {
    if (user && user.username) {
      navigate("/", { replace: true });
    }
    if (user && !name) {
      setName(user.name);
      setSuggestions(generateUsernameSuggestions(user.name));
    }
  }, [user, navigate, name]);

  const refreshSuggestions = useCallback(() => {
    if (name) {
      setSuggestions(generateUsernameSuggestions(name));
    }
  }, [name]);

  const handleSubmit = async () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError("Please enter your display name");
      isValid = false;
    }
    if (!username.trim()) {
      setUsernameError("Please choose a username");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      isValid = false;
    }

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("name", name.trim());
      
      const response = await axios.put<{ user: any }>("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.user) {
        updateUser(response.data.user);
      }

      toast("Welcome aboard!", {
        description: `Your profile has been set up successfully.`,
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

  if (!user || !token) {
    navigate("/");
    return null;
  }


  return (
    <div className="flex min-h-screen py-10 w-full flex-col items-center justify-center p-4 relative overflow-x-hidden overflow-y-auto bg-background">
      {/* Decorative gradient background from framer-motion */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" 
      />
      
      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Animated Progress Bar */}

        <div className="relative overflow-visible w-full min-h-[450px]">
          <AnimatePresence mode="wait">
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full pt-2"
              >
                <Card className="w-full border shadow-lg pt-3">
            
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Display Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => { setName(e.target.value); setNameError(""); }} 
                        placeholder="Your full name" 
                        maxLength={50} 
                        className="h-12" 
                      />
                      {nameError && <p className="text-xs font-medium text-destructive">{nameError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-semibold">Choose a Username</Label>
                      <Input 
                        id="username" 
                        value={username} 
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
                          setUsername(val);
                          setUsernameError("");
                        }} 
                        placeholder="your_username" 
                        maxLength={30} 
                        className="h-12" 
                      />
                      {usernameError && <p className="text-xs font-medium text-destructive">{usernameError}</p>}
                    </div>

                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-2 opacity-60">
                        <span className="text-[11px] text-muted-foreground">Suggestions:</span>
                        {suggestions.map((s) => (
                          <button 
                            key={s} 
                            onClick={() => { setUsername(s); setUsernameError(""); }}
                            className={`text-[11px] underline transition-colors ${username === s ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            @{s}
                          </button>
                        ))}
                        <button onClick={refreshSuggestions} className="text-muted-foreground hover:text-foreground hover:underline text-[11px] flex items-center ml-auto">
                          <RefreshCw className="mr-1 h-2.5 w-2.5" /> <span className="sr-only">Refresh</span>
                        </button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end pt-4 pb-6">
                    <Button onClick={handleSubmit} size="lg" disabled={isSubmitting || username.trim().length < 3 || !name.trim()} className="w-full sm:w-auto font-bold rounded-xl shadow-md transition-all">
                      {isSubmitting ? <Spinner size={20} className="mr-2" /> : <Check className="mr-0 h-5 w-5" />}
                      Complete Setup
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
