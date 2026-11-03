import React from "react";
import { BaseErrorLayout } from "@/components/BaseErrorLayout";
import { PageTitle } from "@/components/PageTitle";

export type ErrorType = "404" | "403" | "400" | "500" | "generic";

interface ErrorPageProps {
  type?: ErrorType;
  error?: string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const ERROR_CONFIG: Record<ErrorType, { title: string; description: string }> = {
  "404": {
    title: "404 Not Found",
    description: "Oops! The page you're searching for seems to have vanished into the gradient cosmos.",
  },
  "403": {
    title: "403 Access Forbidden",
    description: "Your access to Huesole has been suspended. Please contact support if you believe this is a mistake.",
  },
  "400": {
    title: "400 Bad Request",
    description: "The request could not be understood by the server due to malformed syntax.",
  },
  "500": {
    title: "500 Internal Error",
    description: "Something went wrong on our end. We're working to fix it as soon as possible.",
  },
  "generic": {
    title: "Unexpected Error",
    description: "Something went wrong while processing your request. Please try again later.",
  }
};

const PAGE_TITLES: Record<ErrorType, string> = {
  "404": "Page not found — Huesole",
  "403": "Access forbidden — Huesole",
  "400": "Bad request — Huesole",
  "500": "Something went wrong — Huesole",
  generic: "Unexpected error — Huesole",
};

export const ErrorPage: React.FC<ErrorPageProps> = ({ 
  type = "500", 
  error, 
  onRetry,
  title,
  description
}) => {
  const config = ERROR_CONFIG[type] || ERROR_CONFIG["500"];
  
  return (
    <>
      <PageTitle title={PAGE_TITLES[type] || PAGE_TITLES.generic} />
      <BaseErrorLayout
        title={title || config.title}
        description={error || description || config.description}
        actionText={onRetry ? "Retry Connection" : "Back to Home"}
        onAction={onRetry}
        actionHref="/"
      />
    </>
  );
};

export default ErrorPage;

