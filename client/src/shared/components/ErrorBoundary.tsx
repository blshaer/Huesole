import React from "react";
import { Card } from "../ui/card";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: unknown };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-sm border p-6 text-center">
            <h1 className="text-xl font-semibold text-white">
              Something went wrong.
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Try to refresh the page or contact the support.
            </p>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
