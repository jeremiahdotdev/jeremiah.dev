export enum AspectRatio {
    MIN = 0,   // Small devices (640px and up)
    SM = 640,   // Small devices (640px and up)
    MD = 768,   // Medium devices (768px and up)
    LG = 1024,  // Large devices (1024px and up)
    XL = 1280,  // Extra large devices (1280px and up)
    XXL = 1536, // 2x Extra large devices (1536px and up)
    MAX = 9999, // Max size
}
  
// Optional: Create a type for the breakpoints
export type AspectRatioType = keyof typeof AspectRatio;