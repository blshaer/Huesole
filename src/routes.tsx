import { NotFoundPage } from "@/pages/NotFoundPage";
import ErrorBoundary from "@/components/ErrorBoundary";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const PrivacyPage = React.lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = React.lazy(() => import("@/pages/TermsPage"));
const FavoritesPage = React.lazy(() => import("@/pages/FavoritesPage"));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <p className="text-sm text-[#a1a1a1]">loading...</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
