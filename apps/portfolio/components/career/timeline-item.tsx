"use client"

import { FC, ReactNode, memo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TypographyH2, TypographyMuted, TypographySmall } from "@/components/ui/typography"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "../ui/carousel"
import RoleCard from "./role-card"
import type { ClientCareerEvent, ClientJob } from "./timeline"

interface TimelineItem {
    event: ClientCareerEvent
    defaultExpanded?: boolean
    children?: ReactNode
}

interface RoleCarousel {
    roles: ClientJob[]
}

const getRoleId = (role: ClientJob) => `${role.title}-${role.startDate}`

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
    return (
        <Carousel opts={{
            align: "start",
            loop: false,
        }}>
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
            <CarouselDots label="Show position group" />
        </Carousel>
    )
}

const TimelineItem: FC<TimelineItem> = ({event, defaultExpanded = false, children}: TimelineItem) => {
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
                <Avatar className="relative z-10 h-12 w-12 rounded-lg border border-border bg-card p-2 shadow-md transition-colors group-hover:bg-muted md:h-16 md:w-16">
                    <AvatarImage src={event.icon?.src} alt={event.icon?.alt || event.employer} className="object-contain" />
                    <AvatarFallback className="rounded-md bg-transparent text-xs font-bold text-primary md:text-sm">
                        {getOrganizationMark(event.employer)}
                    </AvatarFallback>
                </Avatar>
            </div>
            <article className="min-w-0">
                <header className="relative mb-4 flex flex-col gap-2 md:pl-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-col">
                            <TypographyH2 text={event.employer} className="border-b-0 p-0 text-2xl font-semibold leading-tight tracking-normal" />
                            <TypographyMuted asChild>
                                <span>{event.location}</span>
                            </TypographyMuted>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground sm:justify-end">
                            <TypographySmall className="text-muted-foreground whitespace-nowrap">
                                {event.startDate} - {event.endDate}
                            </TypographySmall>
                            <span aria-hidden="true">·</span>
                            <TypographySmall className="text-muted-foreground whitespace-nowrap">
                                {event.duration}
                            </TypographySmall>
                        </div>
                    </div>
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
                            {children}
                        </div>
                    )}
                </div>
            </article>
        </section>
    )
}

export default memo(TimelineItem)
