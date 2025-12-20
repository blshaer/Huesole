import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Lazy load components for better performance
const HomePage = React.lazy(() => import("@/pages/HomePage"));
const VerifyEmail = React.lazy(() => import("@/features/auth/pages/VerifyEmail"));
const ResetPassword = React.lazy(() => import("@/features/auth/pages/ResetPassword"));
const ProfilePage = React.lazy(() => import("@/features/auth/pages/ProfilePage"));
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPassword = React.lazy(() => import("@/features/auth/pages/ForgotPassword"));

const AppRoutes: React.FC = () => {
  // Loading component
  const LoadingFallback = () => (
    <motion.div
      className="flex h-screen items-center justify-center bg-[var(--background)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-base">
        <Button
          isLoading={true}
          className="flex cursor-text gap-0 border-none bg-transparent"
        >
          Loading...
        </Button>
      </div>
    </motion.div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
