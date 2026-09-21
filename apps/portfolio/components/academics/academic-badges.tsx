"use client";

import { useState } from "react";
import { Portal } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import type { Commendation } from "@/types/commendation";
import { cx } from "class-variance-authority";

type AcademicBadge = Pick<Commendation, "title" | "subtitle" | "label" | "dates" | "tooltip" | "link">;

function AcademicBadgeItem({ award }: { award: AcademicBadge }) {
  const [open, setOpen] = useState(false);
  const className = "flex w-full min-w-0 items-center border-l-2 border-foreground/30 rounded-r-lg bg-foreground/5 px-2.5 py-1 text-left tracking-tight hover:bg-foreground/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 [overflow-wrap:anywhere]";

  const content = <Typography as="span" variant="caption">{award.label ?? `${award.subtitle} ${award.title}`}</Typography>;

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        {award.link ? (
          <a href={award.link} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
        ) : (
          <button type="button" onClick={() => setOpen(!open)} className={className}>{content}</button>
        )}
      </TooltipTrigger>
      <Portal>
        <TooltipContent className="px-3 py-2" sideOffset={6}>
          <Typography variant="caption">{award.title} · {award.subtitle}{award.dates && <span className="whitespace-nowrap"> · {award.dates}</span>}</Typography>
          {award.tooltip && <div className="mt-1"><Typography variant="caption">{award.tooltip}</Typography></div>}
        </TooltipContent>
      </Portal>
    </Tooltip>
  );
}

export default function AcademicBadges({ awards, label, classNames }: { awards: AcademicBadge[]; label: string; classNames?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <ul aria-label={label} className={cx("ml-3 mt-2 grid min-w-0 grid-cols-1 gap-1 sm:ml-4", classNames)}>
        {awards.map((award) => <li key={`${award.subtitle}-${award.title}`} className="min-w-0"><AcademicBadgeItem award={award} /></li>)}
      </ul>
    </TooltipProvider>
  );
}
