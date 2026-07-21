"use client";

import { forwardRef } from "react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type ControlBadgeToggleProps = React.ComponentPropsWithoutRef<typeof Toggle>;

const ControlBadgeToggle = forwardRef<
  React.ElementRef<typeof Toggle>,
  ControlBadgeToggleProps
>(({ className, ...props }, ref) => (
  <Toggle
    ref={ref}
    className={cn(
      "h-11 w-11 rounded-full border border-border/60 bg-background/90 p-0 text-foreground/75 shadow-sm shadow-foreground/10 backdrop-blur hover:text-foreground",
      className,
    )}
    {...props}
  />
));

ControlBadgeToggle.displayName = "ControlBadgeToggle";

export default ControlBadgeToggle;
