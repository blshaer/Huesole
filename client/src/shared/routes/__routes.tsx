import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { NotFoundPage } from "@/pages/NotFoundPage";
import ErrorBoundary from "@/shared/components/ErrorBoundary"; // <-- add

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const VerifyEmail = React.lazy(
  () => import("@/features/auth/pages/VerifyEmail"),
);
const ResetPassword = React.lazy(
  () => import("@/features/auth/pages/ResetPassword"),
);
const ProfilePage = React.lazy(
  () => import("@/features/auth/pages/ProfilePage"),
);
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(
  () => import("@/features/auth/pages/RegisterPage"),
);
const ForgotPassword = React.lazy(
  () => import("@/features/auth/pages/ForgotPassword"),
);
const FavoritesPage = React.lazy(
  () => import("@/features/gradients/pages/FavoritesPage"),
);
const MyGradientsPage = React.lazy(
  () => import("@/features/gradients/pages/MyGradientsPage"),
);
const AIGeneratorPage = React.lazy(
  () => import("@/features/gradients/pages/AIGeneratorPage"),
);
const SupportPage = React.lazy(
  () => import("@/features/support/pages/SupportPage"),
);

const AdminLayout = React.lazy(
  () => import("@/features/admin/layouts/AdminLayout"),
);
const AdminDashboard = React.lazy(
  () => import("@/features/admin/pages/AdminDashboard"),
);
const ManageUsers = React.lazy(
  () => import("@/features/admin/pages/ManageUsers"),
);
const ManageHomeGradients = React.lazy(
  () => import("@/features/admin/pages/ManageHomeGradients"),
);
const SupportInbox = React.lazy(
  () => import("@/features/admin/pages/SupportInbox"),
);

const AppRoutes: React.FC = () => {
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
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-gradients" element={<MyGradientsPage />} />
          <Route path="/ai-generator" element={<AIGeneratorPage />} />

          <Route path="/support" element={<SupportPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="gradients" element={<ManageHomeGradients />} />
            <Route path="support" element={<SupportInbox />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
