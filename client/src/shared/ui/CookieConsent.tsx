import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { X } from "lucide-react";

const CustomCookieIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    id="Layer_2"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 108.48 108.89"
  >
    <path
      id="DSV2-02"
      fill="#edf0f1"
      d="M76.29,54.45c0,1.88,32.38,3.74,32.19,5.57-.19,1.83-.46,3.63-.83,5.41-.36,1.77-.81,3.51-1.34,5.22s-31.48,3.37-31.75,5c-.28,1.63,28.46,3.22,27.63,4.76-.84,1.54-1.75,3.04-2.73,4.49-.98,1.45-2.03,2.85-3.14,4.19-1.11,1.34-25.98,2.63-26.48,3.87-.5,1.23,20.44,2.4,19.09,3.51-1.35,1.11-2.75,2.16-4.2,3.13s-2.95,1.89-4.5,2.73-16.75,1.6-17.41,2.29,9.34,1.3,7.63,1.83c-1.71.53-3.45.98-5.22,1.34-1.77.36-3.58.64-5.41.83s-4.81.28-5.57.28-3.74-.1-5.57-.28-3.64-.46-5.41-.83c-1.77-.36-3.52-.81-5.22-1.34-1.71-.53,8.29-1.14,7.63-1.83s-15.86-1.45-17.41-2.29-3.04-1.75-4.5-2.73-2.85-2.02-4.2-3.13c-1.35-1.11,19.59-2.28,19.09-3.51-.5-1.23-25.37-2.52-26.48-3.87-1.11-1.34-2.16-2.74-3.14-4.19-.98-1.45-1.89-2.95-2.73-4.49-.84-1.54,27.9-3.13,27.63-4.76-.28-1.63-31.22-3.3-31.75-5s-.98-3.45-1.34-5.22c-.36-1.77-.64-3.58-.83-5.41-.19-1.83,32.19-3.69,32.19-5.57S-.19,50.71,0,48.88c.19-1.83.46-3.63.83-5.41.36-1.77.81-3.51,1.34-5.22.53-1.7,31.48-3.37,31.75-5s-28.46-3.22-27.63-4.76c.84-1.54,1.75-3.04,2.73-4.49.98-1.45,2.03-2.85,3.14-4.19s25.98-2.63,26.48-3.87c.5-1.23-20.44-2.4-19.09-3.51,1.35-1.11,2.75-2.16,4.2-3.13,1.45-.98,2.95-1.89,4.5-2.73,1.55-.84,16.75-1.6,17.41-2.29.66-.69-9.34-1.3-7.63-1.83,1.71-.53,3.45-.98,5.22-1.34s3.58-.64,5.41-.83,4.81-.28,5.57-.28,3.74.1,5.57.28,3.64.46,5.41.83,3.52.81,5.22,1.34c1.71.53-8.29,1.14-7.63,1.83.66.69,15.86,1.45,17.41,2.29,1.55.84,3.04,1.75,4.5,2.73,1.45.98,2.85,2.02,4.2,3.13,1.35,1.11-19.59,2.28-19.09,3.51.5,1.23,25.37,2.52,26.48,3.87s2.16,2.74,3.14,4.19c.98,1.45,1.89,2.95,2.73,4.49.84,1.54-27.9,3.13-27.63,4.76s31.22,3.3,31.75,5c.53,1.7.98,3.45,1.34,5.22.36,1.77.64,3.58.83,5.41.19,1.83-32.19,3.69-32.19,5.57Z"
    />
  </svg>
);

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
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
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-6 right-6 z-[9999] w-[calc(100%-3rem)] sm:w-full max-w-[320px] rounded-xl border border-white/10 bg-black/95 p-4 shadow-xl"
        >
          <div className="flex flex-col gap-3 relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-0 top-0 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <CustomCookieIcon className="h-4 w-4" />
              <span className="text-sm font-medium text-white">We use cookies</span>
            </div>
            
            <p className="text-xs text-white/60 leading-relaxed pr-4">
              Cookies help us deliver the best experience on our website.
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Button
                onClick={handleAccept}
                className="h-8 flex-1 bg-white text-black hover:bg-white/90 hover:text-black  text-xs font-medium rounded-lg"
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                onClick={handleDecline}
                className="h-8 flex-1 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium rounded-lg"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
