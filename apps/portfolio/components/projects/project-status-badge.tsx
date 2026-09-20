"use client";

import { useState } from "react";
import { Portal } from "@radix-ui/react-tooltip";
import { Info, TriangleAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/content/content-provider";
import ProjectBadgeLabel from "./project-badge-label";

export default function ProjectStatusBadge({ label }: { label: string }) {
  const { projects: labels } = useDictionary();
  const [open, setOpen] = useState(false);
  const status = label.toLowerCase();
  const deprecated = status === "deprecated";
  const inProgress = status === "in progress";
  const Icon = deprecated ? TriangleAlert : Info;
  const tooltip = deprecated
    ? labels.status.deprecated
    : inProgress
      ? labels.status.inProgress
      : label;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              "inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              !deprecated && !inProgress && "bg-foreground/10",
              deprecated && "bg-orange-500/15 text-orange-800 dark:bg-orange-400/15 dark:text-orange-300",
              inProgress && "bg-blue-500/15 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300",
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <ProjectBadgeLabel label={label} />
          </button>
        </TooltipTrigger>
        <Portal>
          <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))] px-3 py-2" sideOffset={6}>
            <Typography variant="caption">{tooltip}</Typography>
          </TooltipContent>
        </Portal>
      </Tooltip>
    </TooltipProvider>
  );
}
