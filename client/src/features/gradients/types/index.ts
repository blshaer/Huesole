export interface GeneratedGradient {
    name: string;
    colors: string[];
    type: "linear" | "radial" | "conic";
    angle?: number;
}