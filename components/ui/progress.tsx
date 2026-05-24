import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const colorPairs = [
  {start: "rgb(256, 256, 0)", end: "rgb(256, 0, 0)"},
  {start: "rgb(256, 0, 256)", end: "rgb(0, 256, 0)"},
  {start: "rgb(0, 256, 256)", end: "rgb(256, 0, 256)"},
  {start: "rgb(256, 128, 0)", end: "rgb(0, 128, 256)"},
]

const getStableVibrantColor = (label: string) => {
  const hash = Array.from(label).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colorPairs[hash % colorPairs.length]
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, "aria-label": ariaLabel, ...props }, ref) => {
  const labelId = React.useId();
  const label = ariaLabel ?? "Progress";
  const { start: colorStart, end: colorEnd } = getStableVibrantColor(label);
  
  return (
    <>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-slate-200",
          className
        )}
        {...props}
        aria-label={label}
        aria-labelledby={labelId}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 transition-all"
          style={{ 
            transform: `translateX(-${100 - (value || 0)}%)`,
            background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`
          }}
        />
      </ProgressPrimitive.Root>
    </>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
