"use client";

import { memo, useState, type FC } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ControlBadgeLinkProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  className?: string;
  expandedLabel?: string;
}

const ControlBadgeLink: FC<ControlBadgeLinkProps> = ({
  href,
  label,
  Icon,
  className,
  expandedLabel,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={label}
      data-expanded={isInteracting ? "true" : "false"}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-border/60 bg-background/90 font-serif text-sm tracking-widest text-foreground/75 shadow-sm shadow-foreground/10 backdrop-blur transition-colors hover:text-foreground",
        className,
      )}
    >
      {expandedLabel && (
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-[max-width,padding,opacity] duration-300 ease-in-out",
            isInteracting ? "max-w-xs pl-4 pr-3 opacity-100" : "max-w-0 pl-0 pr-0 opacity-0",
          )}
        >
          {expandedLabel}
        </span>
      )}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
    </a>
  );
};

export default memo(ControlBadgeLink);
