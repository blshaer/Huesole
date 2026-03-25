import React from "react";
import { BaseErrorLayout } from "@/shared/components/BaseErrorLayout";

export type ErrorType = "404" | "403" | "400" | "500" | "generic";

interface ErrorPageProps {
  type?: ErrorType;
  error?: string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const ERROR_CONFIG: Record<ErrorType, { title: string; description: string; image?: string }> = {
  "404": {
    title: "404 Not Found",
    description: "Oops! The page you're searching for seems to have vanished into the gradient cosmos.",
    image: "/assets/error.png",
  },
  "403": {
    title: "403 Access Forbidden",
    description: "Your access to LumeGradients has been suspended. Please contact support if you believe this is a mistake.",
    image: "/assets/error.png",
  },
  "400": {
    title: "400 Bad Request",
    description: "The request could not be understood by the server due to malformed syntax.",
    image: "/assets/error.png",
  },
  "500": {
    title: "500 Internal Error",
    description: "Something went wrong on our end. We're working to fix it as soon as possible.",
    image: "/assets/error.png",
  },
  "generic": {
    title: "Unexpected Error",
    description: "Something went wrong while processing your request. Please try again later.",
    image: "/assets/error.png",
  }
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
    <BaseErrorLayout
      title={title || config.title}
      description={error || description || config.description}
      image={config.image}
      actionText={onRetry ? "Retry Connection" : "Back to Home"}
      onAction={onRetry}
      actionHref="/"
    />
  );
};

export default ErrorPage;

