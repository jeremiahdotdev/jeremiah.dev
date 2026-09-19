import { ArrowLeft, ArrowRight } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import type { Dictionary } from "@/types/dictionary";

type PerspectiveContent = Dictionary["academics"]["perspective"];

function PerspectiveItem({ content }: { content: PerspectiveContent["mathematics"] }) {
  return (
    <div className="min-w-0 max-w-full">
      <Typography variant="diagram-label">{content.label}</Typography>
      <Typography as="h3" variant="diagram-title">{content.heading}</Typography>
      {content.description && (
        <div className="mx-auto max-w-xs">
          <Typography variant="diagram-body">{content.description}</Typography>
        </div>
      )}
    </div>
  );
}

function CircleSurface() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-[0%] -z-10 hidden rounded-full border border-black/10 bg-white bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:24px_24px] bg-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.16),inset_0_12px_24px_rgba(0,0,0,0.12),inset_0_-1px_0_rgba(255,255,255,0.4)] dark:bg-[#eee8dc] dark:shadow-[inset_0_4px_8px_rgba(0,0,0,0.28),inset_0_16px_28px_rgba(0,0,0,0.18),inset_0_-1px_0_rgba(255,255,255,0.3)] md:block" />
  );
}

function TabletCircle({ content }: { content: PerspectiveContent["mathematics"] }) {
  return (
    <div className="relative isolate flex aspect-square min-w-0 flex-col items-center justify-center rounded-full px-3 text-center [--foreground:210_12%_13%] [--muted-foreground:210_10%_26%]">
      <CircleSurface />
      <PerspectiveItem content={content} />
    </div>
  );
}

export default function AcademicPerspective({ content }: { content: PerspectiveContent }) {
  return (
    <figure aria-label={content.label} className="flex h-full items-center justify-center py-4 sm:py-5">
      <div className="grid w-full max-w-[60rem] grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)_3rem_minmax(0,1fr)] items-center lg:hidden">
        <TabletCircle content={content.mathematics} />
        <ArrowRight aria-hidden="true" className="h-5 w-full text-foreground/40" strokeWidth={1} />
        <TabletCircle content={content.software} />
        <ArrowLeft aria-hidden="true" className="h-5 w-full text-foreground/40" strokeWidth={1} />
        <TabletCircle content={content.faith} />
      </div>
      <div className="relative isolate hidden aspect-square w-full max-w-[44rem] place-items-center [--foreground:210_12%_13%] [--muted-foreground:210_10%_26%] lg:grid">
        <CircleSurface />
        <div className="grid w-[76%] grid-cols-2 items-start gap-x-4 gap-y-3 py-12 text-center">
          <PerspectiveItem content={content.mathematics} />
          <PerspectiveItem content={content.faith} />
          <div className="col-span-2 min-w-0">
            <svg aria-hidden="true" viewBox="0 0 400 168" preserveAspectRatio="none" className="h-[clamp(2rem,5vw,6rem)] w-full text-foreground/30">
              <path d="M100 0V24H300V0M200 24V168" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="relative pt-4">
              <span aria-hidden="true" className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-foreground/60" />
              <PerspectiveItem content={content.software} />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
