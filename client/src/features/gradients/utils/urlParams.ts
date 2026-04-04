import { GeneratedGradient } from "@/features/gradients/types";

export const serializeGradientToParams = (gradient: GeneratedGradient): string => {
  const params = new URLSearchParams();
  
  if (gradient.name) params.set("name", gradient.name);
  if (gradient.colors) params.set("colors", gradient.colors.join(","));
  if (gradient.type) params.set("type", gradient.type);
  if (gradient.angle !== undefined) params.set("angle", gradient.angle.toString());
  if (gradient.exposure !== undefined) params.set("exposure", gradient.exposure.toString());
  if (gradient.contrast !== undefined) params.set("contrast", gradient.contrast.toString());
  if (gradient.frequency !== undefined) params.set("frequency", gradient.frequency.toString());
  if (gradient.phase !== undefined) params.set("phase", gradient.phase.toString());
  if (gradient.steps !== undefined && gradient.steps !== null) params.set("steps", gradient.steps.toString());
  
  return params.toString();
};

export const deserializeGradientFromParams = (paramsStr: string): Partial<GeneratedGradient> | null => {
  const params = new URLSearchParams(paramsStr);
  const colorsStr = params.get("colors");
  
  if (!colorsStr) return null;
  
  const colors = colorsStr.split(",");
  const type = params.get("type") as "linear" | "radial" | "conic" | null;
  
  return {
    name: params.get("name") || undefined,
    colors,
    type: type || "linear",
    angle: params.get("angle") ? Number(params.get("angle")) : undefined,
    exposure: params.get("exposure") ? Number(params.get("exposure")) : undefined,
    contrast: params.get("contrast") ? Number(params.get("contrast")) : undefined,
    frequency: params.get("frequency") ? Number(params.get("frequency")) : undefined,
    phase: params.get("phase") ? Number(params.get("phase")) : undefined,
    steps: params.get("steps") ? Number(params.get("steps")) : null,
  };
};
