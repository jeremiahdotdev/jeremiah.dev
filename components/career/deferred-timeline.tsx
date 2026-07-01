"use client"

import dynamic from "next/dynamic";
import { CareerEvent } from "@/types/job";

const Timeline = dynamic(() => import("@/components/career/timeline"), {
  ssr: false,
  loading: () => (
    <div className="w-full px-4 py-8 md:px-8 md:py-10">
      <div className="h-64 w-full rounded-md border border-border/60 bg-background-secondary/60" />
    </div>
  ),
})

interface DeferredTimelineProps {
  events: CareerEvent[]
}

export default function DeferredTimeline({ events }: DeferredTimelineProps) {
  return <Timeline events={events} />
}
