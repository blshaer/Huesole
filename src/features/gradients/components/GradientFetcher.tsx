import React, { useState, useEffect } from "react";
import gradientsData from "@/shared/lib/gradients.json";

// Type definition for gradient data
interface Gradient {
  name: string;
  colors: string[];
  colorsname: string[];
  keywords: string[][];
}

const GradientFetcher: React.FC = () => {
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loads gradients from the local gradientsData
  const loadGradients = () => {
    setIsLoading(true);
    setError(null);
    try {
      setGradients(gradientsData as Gradient[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gradients");
      console.error("Error loading gradients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadGradients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry just calls local loader again
  const handleRetry = () => {
    loadGradients();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading gradients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-red-500">
          <p className="font-semibold">Error loading gradients</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={handleRetry}
          className="hover:bg-primary/90 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">
        Loaded {gradients.length} Gradients
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gradients.slice(0, 6).map((gradient) => (
          <div key={gradient.name} className="rounded-lg border p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">{gradient.name}</h3>
            <div
              className="mb-3 h-20 rounded"
              style={{
                background: `linear-gradient(135deg, ${gradient.colors.join(", ")})`,
              }}
            />
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Colors:</strong> {gradient.colorsname.join(", ")}
              </p>
              <p>
                <strong>Keywords:</strong>{" "}
                {gradient.keywords.flat().slice(0, 3).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      {gradients.length > 6 && (
        <p className="mt-4 text-center text-muted-foreground">
          ...and {gradients.length - 6} more gradients
        </p>
      )}
    </div>
  );
};

export default GradientFetcher;
