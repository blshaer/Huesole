import { BaseErrorLayout } from "@/shared/components/BaseErrorLayout";

export function NotFoundPage() {
  return (
    <BaseErrorLayout
      title="404 Not Found"
      description="Oops! The page you're searching for seems to have vanished into the gradient cosmos."
      actionHref="/"
      actionText="Back to Home"
    />
  );
}
