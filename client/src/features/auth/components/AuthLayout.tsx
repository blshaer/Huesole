import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  showGoogle?: boolean;
  googleLoading?: boolean;
  onGoogleClick?: () => void;
  containerClassName?: string;
}

export const AuthLayout = ({
  title,
  description,
  children,
  footer,
  showGoogle = false,
  googleLoading = false,
  onGoogleClick,
  containerClassName = "",
}: AuthLayoutProps) => {
  return (
    <div className={`relative flex min-h-[90vh] items-center justify-center overflow-hidden p-6 ${containerClassName}`}>
      {/* Background Pulse Effect */}

      <Card className="border-border/40 bg-background/60 z-10 w-full max-w-md shadow-2xl backdrop-blur-xl transition-all duration-300">
        <CardHeader className="flex flex-col items-center space-y-4 pb-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-white/50 px-4">
              {description}
            </CardDescription>
          </div>

          {showGoogle && (
            <div className="w-full space-y-6">
              <div className="flex justify-center transition-opacity hover:opacity-90">
                {googleLoading ? (
                  <Button
                    className="h-11 w-[280px] font-medium"
                    variant="outline"
                    disabled
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting with Google...
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-[280px] rounded-md border-primary/20 bg-background/50 font-medium transition-all hover:bg-background/80"
                    onClick={onGoogleClick}
                  >
                    <img src="/app/assets/google.svg" alt="Google" className="mr-3 h-5 w-5" />
                    Sign in with Google
                  </Button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-dotted border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="glass-morphism bg-background px-2 text-white/60">
                    or continue with
                  </span>
                </div>
              </div>
            </div>
          )}

        </CardHeader>
        
        <CardContent>
          {children}
        </CardContent>

        <CardFooter className="border-border/40 flex flex-col gap-4 border-t pb-8 pt-6">
          {footer}
        </CardFooter>
      </Card>
    </div>
  );
};
