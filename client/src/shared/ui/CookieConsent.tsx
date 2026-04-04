import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        toast("Privacy & Cookies", {
          description: "Please review your cookie preferences to continue.",
          icon: <Cookie className="h-4 w-4" />,
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    window.dispatchEvent(new Event("cookie-consent-updated"));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    window.dispatchEvent(new Event("cookie-consent-updated"));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/60 p-6 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Animated Gradient Border Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-inner">
                <Cookie className="h-7 w-7 text-primary animate-pulse" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">Cookie Preference</h3>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/10">
                    <ShieldCheck className="h-3 w-3" />
                    Secure
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  We use cookies to personalize your experience and analyze our traffic. 
                  Accepting helps us provide a more secure and tailored environment for you.
                </p>
              </div>

              <div className="flex w-full items-center gap-3 md:w-auto">
                <Button
                  variant="ghost"
                  onClick={handleDecline}
                  className="flex-1 text-white/30 hover:bg-white/5 hover:text-white md:flex-none h-11 px-6 rounded-xl transition-all"
                >
                  Essential Only
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-white font-bold text-black hover:bg-white/90 md:flex-none h-11 px-10 rounded-xl shadow-lg hover:shadow-white/10 transition-all active:scale-95"
                >
                  Accept All
                </Button>
              </div>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-4 text-white/10 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
