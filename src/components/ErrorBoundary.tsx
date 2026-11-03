import React from "react";
import { BaseErrorLayout } from "./BaseErrorLayout";

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
        <BaseErrorLayout
          title="App Crash"
          description="Something went wrong while rendering the page. Try refreshing or contact support."
          actionText="Refresh Page"
          onAction={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}
