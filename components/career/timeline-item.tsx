"use client"

import { CareerEvent, Job } from "@/types/job"
import { FC, memo, useEffect, useState } from "react"
import HoverBadgeList from "../shared/hover-badge-list"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel"
import RoleCard from "./role-card"

interface TimelineItem {
    event: CareerEvent
    defaultExpanded?: boolean
}

interface RoleCarousel {
    roles: Job[]
}

const getUniqueSkills = (event: CareerEvent) => {
    const skills = event.roles.flatMap((role) => role.skills)
    return skills.filter((skill, index) => (
        skills.findIndex((existingSkill) => existingSkill.subtitle === skill.subtitle) === index
    ))
}

const getRoleId = (role: Job) => `${role.title}-${role.startDate}`

const getRoleItemClassName = (roleCount: number) => {
    if (roleCount === 1) {
        return "basis-full"
    }

    if (roleCount === 2) {
        return "basis-full md:basis-1/2"
    }

    return "basis-[88%] sm:basis-[70%] lg:basis-1/2 xl:basis-1/3"
}

const getOrganizationMark = (employer: string) => {
    return employer
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
}

const RoleCarousel: FC<RoleCarousel> = ({roles}: RoleCarousel) => {
    const [api, setApi] = useState<CarouselApi>()
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [snapCount, setSnapCount] = useState(0)

    useEffect(() => {
        if (!api) return

        const updateCarouselState = () => {
            setSelectedIndex(api.selectedScrollSnap())
            setSnapCount(api.scrollSnapList().length)
        }

        updateCarouselState()
        api.on("select", updateCarouselState)
        api.on("reInit", updateCarouselState)

        return () => {
            api.off("select", updateCarouselState)
            api.off("reInit", updateCarouselState)
        }
    }, [api])

    return (
        <Carousel opts={{
            align: "start",
            loop: false,
        }} setApi={setApi}>
            <CarouselContent className="items-stretch">
                {roles.map((role) => {
                    const roleId = getRoleId(role)

                    return (
                        <CarouselItem key={roleId} className={getRoleItemClassName(roles.length)}>
                            <RoleCard role={role}/>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            {snapCount > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: snapCount }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Show position group ${index + 1}`}
                            aria-current={selectedIndex === index}
                            onClick={(event) => {
                                event.stopPropagation()
                                api?.scrollTo(index)
                            }}
                            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                                selectedIndex === index
                                    ? "text-primary"
                                    : "text-primary/50 hover:text-primary"
                            }`}
                        >
                            <span className="h-2.5 w-2.5 rounded-full border border-current bg-current" />
                        </button>
                    ))}
                </div>
            )}
        </Carousel>
    )
}

const TimelineItem: FC<TimelineItem> = ({event, defaultExpanded = false}: TimelineItem) => {
    const [expanded, setExpanded] = useState(defaultExpanded)
    const toggleExpanded = () => setExpanded((current) => !current)

    return (
        <section
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${event.employer}`}
            onClick={toggleExpanded}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    toggleExpanded()
                }
            }}
            className="group relative grid cursor-pointer grid-cols-1 gap-0 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6"
        >
            <div className="hidden justify-center md:flex">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border bg-card text-xs font-bold text-primary shadow-md transition-colors group-hover:bg-muted md:h-16 md:w-16 md:text-sm">
                    {getOrganizationMark(event.employer)}
                </span>
            </div>
            <article className="min-w-0">
                <header className="relative mb-4 flex flex-col gap-2 md:pl-8">
                    <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <span className="flex flex-col">
                            <h2 className="text-2xl font-semibold leading-tight">{event.employer}</h2>
                            <span className="text-sm text-muted-foreground">{event.location}</span>
                        </span>
                        <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground sm:justify-end">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{event.startDate} - {event.endDate}</span>
                            <span aria-hidden="true">·</span>
                            <span className="whitespace-nowrap">{event.duration}</span>
                        </span>
                    </span>
                </header>
                <div className="min-w-0 md:pl-8">
                    <div
                        className={`relative overflow-hidden ${
                            expanded ? "max-h-[32rem] md:max-h-[36rem]" : "max-h-28 md:max-h-32"
                        }`}
                    >
                        <RoleCarousel roles={event.roles}/>
                        {!expanded && (
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background-secondary"/>
                        )}
                    </div>
                    {expanded && (
                        <div
                            className="mt-6 flex flex-col gap-3"
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                        >
                            <hr></hr>
                            <HoverBadgeList badges={getUniqueSkills(event)}/>
                        </div>
                    )}
                </div>
            </article>
        </section>
    )
}

export default memo(TimelineItem)
