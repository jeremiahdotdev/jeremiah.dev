"use client";

import { useState } from "react";
import { Portal } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import type { Commendation } from "@/types/commendation";

type AcademicBadge = Pick<Commendation, "title" | "subtitle" | "label" | "dates" | "tooltip" | "link">;

function AcademicBadgeItem({ award }: { award: AcademicBadge }) {
  const [open, setOpen] = useState(false);
  const className = "inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/5 px-2.5 py-1 hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:px-3 lg:py-1.5";

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
        <TooltipContent className="max-w-[min(28rem,calc(100vw-2rem))] px-3 py-2" sideOffset={6}>
          <Typography variant="caption">{award.title} · {award.subtitle}{award.dates && <span className="whitespace-nowrap"> · {award.dates}</span>}</Typography>
          {award.tooltip && <div className="mt-1"><Typography variant="caption">{award.tooltip}</Typography></div>}
        </TooltipContent>
      </Portal>
    </Tooltip>
  );
}

export default function AcademicBadges({ awards, label }: { awards: AcademicBadge[]; label: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <ul aria-label={label} className="mt-4 flex flex-wrap gap-1.5">
        {awards.map((award) => <li key={`${award.subtitle}-${award.title}`}><AcademicBadgeItem award={award} /></li>)}
      </ul>
    </TooltipProvider>
  );
}
