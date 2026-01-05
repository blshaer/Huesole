import { NotFoundPage } from "@/pages/NotFoundPage";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/shared/routes/ProtectedRoute";

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const VerifyEmail = React.lazy(() => import("@/pages/VerifyEmail"));
const ResetPassword = React.lazy(() => import("@/pages/ResetPassword"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/pages/RegisterPage"));
const ForgotPassword = React.lazy(() => import("@/pages/ForgotPassword"));

const FavoritesPage = React.lazy(() => import("@/features/gradients/pages/FavoritesPage"));
const MyGradientsPage = React.lazy(() => import("@/features/gradients/pages/MyGradientsPage"));
const AIGeneratorPage = React.lazy(() => import("@/features/gradients/pages/AIGeneratorPage"));

const SupportPage = React.lazy(() => import("@/features/support/pages/SupportPage"));

const AdminLayout = React.lazy(() => import("@/features/admin/layouts/AdminLayout"));
const AdminDashboard = React.lazy(() => import("@/features/admin/pages/AdminDashboard"));
const ManageUsers = React.lazy(() => import("@/features/admin/pages/ManageUsers"));
const ManageHomeGradients = React.lazy(() => import("@/features/admin/pages/ManageHomeGradients"));
const SupportInbox = React.lazy(() => import("@/features/admin/pages/SupportInbox"));

const AppRoutes: React.FC = () => {
  const LoadingFallback = () => (
    <motion.div
      className="flex h-screen items-center justify-center bg-[var(--background)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button
        isLoading
        className="cursor-text border-none bg-transparent"
      >
        Loading...
      </Button>
    </motion.div>
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/my-gradients" element={<MyGradientsPage />} />
            <Route path="/ai-generator" element={<AIGeneratorPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>

          {/* Admin (still assumes internal admin guard) */}
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
