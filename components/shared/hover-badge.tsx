import { HoverTooltip } from "./hover-tooltip"
import Badge, { Badging } from "./badge"

interface HoverBadgeProps {
    badge: Badging
}

export default function HoverBadge({ badge }: HoverBadgeProps) {
    return (
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
    )
}
