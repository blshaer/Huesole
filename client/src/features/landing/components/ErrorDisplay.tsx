interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="mb-4 text-red-500">Error loading gradients: {error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="hover:bg-primary/90 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      )}
    </div>
  );
};
