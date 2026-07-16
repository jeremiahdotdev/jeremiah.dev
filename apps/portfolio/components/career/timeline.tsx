"use client"

import TimelineItem from "./timeline-item"
import { CareerEvent, Job } from "@/types/job"
import { Skill } from "@/types/skill"
import HoverBadgeList from "../shared/hover-badge-list"
import { Separator } from "@radix-ui/react-dropdown-menu"

interface Timeline {
    events: CareerEvent[]
}

const getUniqueSkills = (event: CareerEvent) => {
    const skills = event.roles.flatMap((role) => role.skills)
    return skills.filter((skill, index) => (
        skills.findIndex((existingSkill) => existingSkill.subtitle === skill.subtitle) === index
    ))
}

type ClientSkill = Omit<Skill, "image">
type ClientJob = Omit<Job, "skills"> & {
    skills: ClientSkill[]
}
type ClientCareerEvent = Omit<CareerEvent, "roles"> & {
    roles: ClientJob[]
}

const toClientEvent = (event: CareerEvent): ClientCareerEvent => ({
    ...event,
    roles: event.roles.map((role) => ({
        ...role,
        skills: role.skills.map(({ image, ...skill }) => skill),
    })),
})

export type { ClientCareerEvent, ClientJob }

export default function Timeline({events}: Timeline) {
    return (
        <div className="w-full max-w-screen-xl py-8">
            <div className="relative flex flex-col gap-4">
                <span className="absolute bottom-8 left-14 top-8 hidden w-px bg-border flex-col md:flex"/>
                {events.map((job: CareerEvent, index: number) => (
                    <>
                        <TimelineItem key={job.employer} event={toClientEvent(job)} defaultExpanded={index === 0}>
                            <HoverBadgeList badges={getUniqueSkills(job)}/>
                        </TimelineItem>
                        {index < events.length - 1 && (
                            <Separator key={`${job.employer}-separator`} className="border-t border-border/50 md:hidden"/>
                        )}
                    </>
                ))}
            </div>
        </div>
    )
}
