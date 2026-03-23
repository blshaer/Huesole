import React from "react";
import { BaseErrorLayout } from "@/shared/components/BaseErrorLayout";

interface ErrorPageProps {
  error?: string;
  onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, onRetry }) => {
  return (
    <BaseErrorLayout
      title="Internal Error"
      description={error || "Something went wrong on our end. We're working to fix it as soon as possible."}
      actionText={onRetry ? "Retry Connection" : "Back to Home"}
      onAction={onRetry}
      actionHref="/"
    />
  );
};

export default ErrorPage;
