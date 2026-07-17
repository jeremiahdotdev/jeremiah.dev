"use client"

import { CSSProperties, FC, ReactNode, memo, useLayoutEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TypographyH1, TypographyMuted, TypographySmall } from "@/components/ui/typography"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "../ui/carousel"
import RoleCard from "./role-card"
import type { ClientCareerEvent, ClientJob } from "./timeline"
import { Separator } from "@radix-ui/react-dropdown-menu"

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
        return "basis-[84%] md:basis-1/2"
    }

    return "basis-[84%] sm:basis-[70%] lg:basis-1/2 xl:basis-1/3"
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

const ChevronIndicator = ({expanded}: {expanded: boolean}) => (
    <span
        aria-hidden="true"
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-all duration-300 ease-out group-hover:border-primary/30 group-hover:text-foreground ${
            expanded && "rotate-180 text-foreground"
        }`}
    >
        <ChevronDown className="h-4 w-4" />
    </span>
)

const RoleCarousel: FC<RoleCarousel> = ({roles}: RoleCarousel) => {
    return (
        <Carousel
            opts={{
                align: "center",
                loop: false,
            }}
            className="relative w-[100vw]"
        >
            <CarouselContent className="py-3">
                {roles.map((role, index) => {
                    const roleId = getRoleId(role)

                    return (
                        <CarouselItem key={roleId} className={getRoleItemClassName(roles.length)}>
                            <RoleCard role={role} className={index === 0 ? "md:ml-8" : index === roles.length - 1 ? "md:mr-8" : ""}/>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            {roles.length > 1 && <CarouselDots label="Show position" />}
        </Carousel>
    )
}

const TimelineItem: FC<TimelineItem> = ({event, defaultExpanded = false, children}: TimelineItem) => {
    const [expanded, setExpanded] = useState(defaultExpanded)
    const [contentMounted, setContentMounted] = useState(defaultExpanded)
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)
    const toggleExpanded = () => {
        if (!expanded) {
            setContentHeight(0)
            setContentMounted(true)
            setExpanded(true)

            return
        }

        const content = contentRef.current

        if (content) {
            setContentHeight(content.scrollHeight)
            window.requestAnimationFrame(() => setExpanded(false))

            return
        }

        setExpanded((current) => !current)
    }

    useLayoutEffect(() => {
        if (!contentMounted || !expanded) {
            return
        }

        const content = contentRef.current

        if (!content) {
            return
        }

        const updateContentHeight = () => setContentHeight(content.scrollHeight)
        let resizeObserver: ResizeObserver | undefined
        const animationFrame = window.requestAnimationFrame(() => {
            updateContentHeight()
            resizeObserver = new ResizeObserver(updateContentHeight)
            resizeObserver.observe(content)
        })

        return () => {
            window.cancelAnimationFrame(animationFrame)
            resizeObserver?.disconnect()
        }
    }, [contentMounted, expanded])

    const contentStyle = {
        maxHeight: expanded ? `${contentHeight}px` : "0px",
        opacity: expanded ? 1 : 0,
        transition: "max-height 300ms ease-out, opacity 300ms ease-out",
    } satisfies CSSProperties

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
            className="group relative grid cursor-pointer grid-cols-1 py-2 gap-0"
        >
            <div className="px-4 flex w-full flex-row gap-4">
                <Avatar className="relative h-16 w-16 items-center justify-center rounded-lg border border-border bg-background md:h-20 md:w-20">
                    <AvatarImage src={event.icon?.src} alt={event.icon?.alt || event.employer} className="h-12 w-12 md:h-14 md:w-14 object-contain" />
                    <AvatarFallback>{getOrganizationMark(event.employer)}</AvatarFallback>
                </Avatar>
                <div className="relative flex w-full flex-row items-center justify-between gap-4">
                    <div className="relative flex min-w-0 flex-col gap-1">
                        <TypographyH1 className="font-semibold">{event.employer}</TypographyH1>
                        <TypographyMuted className="text-sm">{event.location}</TypographyMuted>
                        <TypographySmall className="text-sm text-muted-foreground md:hidden">{event.startYear} - {event.endYear} · {event.duration}</TypographySmall>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden flex-col items-end gap-1 md:flex">
                            <TypographySmall className="text-sm text-muted-foreground">{event.startYear} - {event.endYear}</TypographySmall>
                            <TypographySmall className="text-sm text-muted-foreground">{event.duration}</TypographySmall>
                        </div>
                        <ChevronIndicator expanded={expanded} />
                    </div>
                </div>
            </div>
            {contentMounted && (
                <div
                    className="col-span-full overflow-hidden"
                    style={contentStyle}
                    onTransitionEnd={(event) => {
                        if (event.currentTarget === event.target && event.propertyName === "max-height" && !expanded) {
                            setContentHeight(0)
                            setContentMounted(false)
                        }
                    }}
                >
                    <div ref={contentRef} className="overflow-hidden">
                        <RoleCarousel roles={event.roles}/>
                        <div className="p-4 md:px-20">
                            <Separator className="m-2 border-t border-border"/>
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default memo(TimelineItem)
