"use client"
import { FC, memo, useMemo } from "react"
import TimelineItem from "./timeline-item"
import { CareerEvent } from "@/types/job"

interface Timeline {
    events: CareerEvent[]
}

const Timeline: FC<Timeline> = ({events}: Timeline) => {
    const component = useMemo(() => (
        <div className="w-full px-4 py-8 md:px-8 md:py-10">
            <div className="relative flex flex-col gap-10 md:gap-16">
                <span className="absolute bottom-8 left-8 top-8 hidden w-px bg-border md:block"/>
                {events.map((job: CareerEvent, index: number) => (
                    <TimelineItem key={job.employer} event={job} defaultExpanded={index === 0}/>
                ))}
            </div>
        </div>
    ), [events])

    return component
}

export default memo(Timeline)
