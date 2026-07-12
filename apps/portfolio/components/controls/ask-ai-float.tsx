"use client";

import { memo, useState, type FC } from "react";
import { MessageCircle } from "lucide-react";

import { useDictionary } from "@/components/content/content-provider";
import { cn } from "@/lib/utils";

interface AskAiFloatProps {
  className?: string;
}

const AskAiFloat: FC<AskAiFloatProps> = ({ className }) => {
  const $t = useDictionary();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const isExpanded = !isCollapsed || isInteracting;

  const menuStyle =
    "inline-flex items-center rounded-full border border-border/60 bg-background/90 font-serif text-sm tracking-widest text-foreground/75 shadow-sm shadow-foreground/10 backdrop-blur";
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={$t.links.ai}
      aria-label={$t.controls.askAi}
      data-expanded={isExpanded ? "true" : "false"}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      className={cn(
        "overflow-hidden",
        className,
        menuStyle,
      )}
    >
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-[width,padding,opacity] duration-300 ease-in-out",
          isExpanded ? "w-[15rem] pl-4 pr-11 opacity-100" : "w-0 pl-0 pr-0 opacity-0",
        )}
      >
        {$t.controls.askAiPrompt}
      </span>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        <MessageCircle className="h-6 w-6" />
      </span>
    </a>
  );
};

export default memo(AskAiFloat);
