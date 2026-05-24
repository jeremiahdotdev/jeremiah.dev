import TimelineItem from "./timeline-item"
import { CareerEvent, Job } from "@/types/job"
import { Skill } from "@/types/skill"
import HoverBadgeList from "../shared/hover-badge-list"

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
        <div className="w-full px-4 py-8 max-w-screen-xl md:px-8 md:py-10">
            <div className="relative flex flex-col gap-8">
                <span className="absolute bottom-8 left-8 top-8 hidden w-px bg-border md:block"/>
                {events.map((job: CareerEvent, index: number) => (
                    <TimelineItem key={job.employer} event={toClientEvent(job)} defaultExpanded={index === 0}>
                        <HoverBadgeList badges={getUniqueSkills(job)}/>
                    </TimelineItem>
                ))}
            </div>
        </div>
    )
}
