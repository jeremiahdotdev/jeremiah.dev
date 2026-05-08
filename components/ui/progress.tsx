import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const getRandomVibrantColor = () => {
  let colors = [256, 256, 0, 0]
  colors.sort(() => Math.random() - 0.5);
  return { 
    start: `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`, 
    end: `rgb(${colors[1]}, ${colors[2]}, ${colors[3]})`, 
  };
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const { start: colorStart, end: colorEnd } = getRandomVibrantColor();
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-200",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
