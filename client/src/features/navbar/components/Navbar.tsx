import {
  Pipette,
  User as UserIcon,
  LogOut,
  Heart,
  Sparkles,
  Layers,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { getFullImageUrl } from "@/shared/utils/imageUrl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useState, useEffect } from "react";
import Logo from "@/shared/ui/Logo";
import { toast } from "@/shared/hooks/use-toast";
import { GeneratedGradient } from "@/features/gradients/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { AnimationSection } from "@/features/gradients/components/AnimationSection";
import { ExportSection } from "@/features/gradients/components/ExportSection";
import { Button } from "@/shared/ui/button";

interface NavbarProps {
  result?: GeneratedGradient | null;
  isAnimated?: boolean;
  setIsAnimated?: (value: boolean) => void;
  animationSpeed?: number;
  setAnimationSpeed?: (value: number) => void;
}

export const Navbar = ({
  result = null,
  isAnimated = false,
  setIsAnimated,
  animationSpeed = 1,
  setAnimationSpeed,
}: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);
  const [isMotionDialogOpen, setIsMotionDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const isAIGeneratorPage = location.pathname.startsWith("/ai-generator");

  useEffect(() => {
    setIsEyeDropperSupported("EyeDropper" in window);
  }, []);

  const handleColorPick = async () => {
    if (!("EyeDropper" in window)) {
      toast({
        title: "Error",
        description: "Color picker is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      // @ts-ignore
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        await navigator.clipboard.writeText(result.sRGBHex);
        toast({
          title: "Copied!",
          description: `Color ${result.sRGBHex} copied to clipboard!`,
        });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast({
          title: "Error",
          description: "Failed to pick color",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAIGenerateClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login first to use the AI Generator.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/ai-generator");
  };

  return (
    <header className="disable-animation-on-theme-change sticky top-0 z-[100] w-full bg-background backdrop-blur-sm container">
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .pipette-button:hover {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="container mx-auto flex w-full items-center justify-between px-0 py-3 lg:py-5">
        <nav
          className="flex items-center gap-6 md:gap-10"
          aria-label="Primary navigation"
        >
          <Logo />
        </nav>

        <div className="relative z-50 flex items-center gap-3 md:gap-3">
          <div className="flex items-center gap-2">
            {/* AI Generate Button - Hidden on AI Generator Page */}
            {!isAIGeneratorPage && (
              <button
                onClick={handleAIGenerateClick}
                className="group hidden items-center gap-2 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 transition-all hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] sm:flex"
              >
                <Sparkles size={16} className="group-hover:animate-pulse" />
                <span>AI Generate</span>
              </button>
            )}

            {/* Motion Effects Dialog - Only on AI Generator Page */}
            <AnimatePresence>
              {isAIGeneratorPage &&
                typeof setIsAnimated === "function" &&
                typeof setAnimationSpeed === "function" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block"
                  >
                    <Dialog
                      open={isMotionDialogOpen}
                      onOpenChange={setIsMotionDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          className={`flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-medium transition-all ${
                            isAnimated
                              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                              : "border-border bg-card text-foreground/70 hover:bg-white/5"
                          }`}
                          title={
                            isAnimated
                              ? "Animation Active"
                              : "Animation Inactive"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {isAnimated ? (
                              <polygon points="6 3 20 12 6 21 6 3" />
                            ) : (
                              <>
                                <rect
                                  x="14"
                                  y="4"
                                  width="4"
                                  height="16"
                                  rx="1"
                                />
                                <rect
                                  x="6"
                                  y="4"
                                  width="4"
                                  height="16"
                                  rx="1"
                                />
                              </>
                            )}
                          </svg>
                          <span>Motion</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Motion Effects</DialogTitle>
                          <DialogDescription>
                            Control animation settings for your gradient
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <AnimationSection
                            isAnimated={isAnimated}
                            setIsAnimated={setIsAnimated}
                            animationSpeed={animationSpeed}
                            setAnimationSpeed={setAnimationSpeed}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setIsMotionDialogOpen(false)}
                          >
                            Done
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Export Dialog - Only on AI Generator Page */}
            <AnimatePresence>
              {isAIGeneratorPage && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="hidden sm:block"
                >
                  <Dialog
                    open={isExportDialogOpen}
                    onOpenChange={setIsExportDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <button
                        className="flex items-center gap-2 rounded-[8px] border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:bg-white/5"
                        title="Export gradient"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        <span>Export</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Export Gradient
                        </DialogTitle>
                        <DialogDescription>
                          Export your gradient in various formats and sizes
                        </DialogDescription>
                      </DialogHeader>
                      {/* FIX: pass current gradient + animation values */}
                      <ExportSection
                        result={result}
                        isAnimated={isAnimated}
                        animationSpeed={animationSpeed}
                      />
                    </DialogContent>
                  </Dialog>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Color Picker */}
            <div className="hidden origin-center transform-gpu sm:block">
              <button
                onClick={handleColorPick}
                disabled={!isEyeDropperSupported}
                className="rounded-[8px] border bg-card p-2 transition-all hover:bg-white/5 disabled:opacity-50"
                aria-label="Pick color from screen"
                title={
                  isEyeDropperSupported
                    ? "Pick color from screen"
                    : "Not supported in this browser"
                }
              >
                <Pipette size={18} className="transition-transform" />
                <span className="sr-only">Pick color from screen</span>
              </button>
            </div>
          </div>

          {/* User Avatar / Auth Section */}
          <div className="relative flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus-visible:ring-ring/70 relative z-50 rounded-full outline-none focus-visible:ring-2">
                  <Avatar className="hover:border-primary/50 h-9 w-9 border-2 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
                    <AvatarImage
                      src={getFullImageUrl(user.picture)}
                      alt={user.name}
                    />
                    <AvatarFallback
                      className="bg-cover bg-center font-semibold text-white"
                      style={{
                        backgroundImage:
                          'url("https://vercel.com/api/www/avatar/SA7kRQYuUGOPuPmxWAQycgXZ")',
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="z-[150] w-56 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/90 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl dark:bg-gray-950/90"
                >
                  <DropdownMenuLabel className="px-3 py-2 backdrop-blur-sm">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs leading-none text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-white/10" />
                  <DropdownMenuItem
                    className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                    asChild
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-2 py-1.5"
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                    asChild
                  >
                    <Link
                      to="/favorites"
                      className="flex items-center px-2 py-1.5"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                    asChild
                  >
                    <Link
                      to="/my-gradients"
                      className="flex items-center px-2 py-1.5"
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      <span>My Gradients</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-white/10" />
                  <DropdownMenuItem
                    className="mx-2 my-1 cursor-pointer rounded-lg text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                    asChild
                  >
                    <Link
                      to="/ai-generator"
                      className="flex items-center px-2 py-1.5"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>AI Generator</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-white/10" />
                  <DropdownMenuItem
                    className="mx-2 my-1 cursor-pointer rounded-lg px-2 py-1.5 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/30 focus:text-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-[8px] border bg-card px-4 py-1.5 text-sm font-medium transition-all hover:bg-white/5"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border Line */}
      <div
        className="h-[1px] w-full opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--muted-foreground) 0%, var(--muted-foreground) 2px, transparent 2px, transparent 12px)",
          backgroundSize: "6px 1px",
        }}
      ></div>
    </header>
  );
};
