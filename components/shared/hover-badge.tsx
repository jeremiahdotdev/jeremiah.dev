"use client"
import React, { FC, ReactNode, memo, useMemo } from "react"
import { HoverTooltip } from "./hover-tooltip"
import Badge from "./badge"

export type Badging = {
    subtitle?: string,
    image?: ReactNode,
    href?: string,
}

interface HoverBadgeProps {
    badge: Badging
}

const HoverBadge: FC<HoverBadgeProps> = ({ badge }: HoverBadgeProps) => {  
    const component = useMemo(() => (
        <HoverTooltip tooltip={badge.href} asChild>
            <a
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={badge.subtitle ? `Open ${badge.subtitle}` : undefined}
            >
                <Badge badge={badge}/>
            </a>
        </HoverTooltip>
    ), [badge])

    return component
}

export default memo(HoverBadge)
