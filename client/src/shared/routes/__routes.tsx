import { NotFoundPage } from "@/pages/NotFoundPage";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
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
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));
const PrivacyPage = React.lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("@/pages/TermsPage"));
const ErrorPreviewPage = React.lazy(() => import("@/pages/ErrorPreviewPage"));
const OnboardingPage = React.lazy(() => import("@/pages/OnboardingPage"));

const FavoritesPage = React.lazy(() => import("@/features/gradients/pages/FavoritesPage"));
const AIGeneratorPage = React.lazy(() => import("@/features/gradients/pages/AIGeneratorPage"));



const AdminLayout = React.lazy(() => import("@/features/admin/layouts/AdminLayout"));
const AdminDashboard = React.lazy(() => import("@/features/admin/pages/AdminDashboard"));
const ManageUsers = React.lazy(() => import("@/features/admin/pages/ManageUsers"));
const ManageHomeGradients = React.lazy(() => import("@/features/admin/pages/ManageHomeGradients"));
const SupportInbox = React.lazy(() => import("@/features/admin/pages/SupportInbox"));
const ManagePages = React.lazy(() => import("@/features/admin/pages/ManagePages"));

import { VercelSpinner } from "@/shared/ui/VercelSpinner";

const AppRoutes: React.FC = () => {
  const LoadingFallback = () => (
    <motion.div
      className="flex h-screen flex-col items-center justify-center bg-background gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <VercelSpinner size={40} />
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/error-preview" element={<ErrorPreviewPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/ai-generator" element={<AIGeneratorPage />} />

            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Admin (still assumes internal admin guard) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="gradients" element={<ManageHomeGradients />} />
            <Route path="support" element={<SupportInbox />} />
            <Route path="pages" element={<ManagePages />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
