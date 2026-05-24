import { ReactNode } from "react"
import { Badge as Root } from "@/components/ui/badge"

export type Badging = {
    subtitle?: string,
    image?: ReactNode,
    href?: string,
}

interface BadgeProps {
    badge: Badging
}

export default function Badge({ badge }: BadgeProps) {
    return (
        <Root variant="outline" className="flex items-center justify-center gap-2 border-foreground/20 bg-card p-1 shadow-sm shadow-foreground/20">
            {badge.image && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                    {badge.image}
                </span>
            )}
            <p>
                {badge.subtitle}
            </p>
        </Root>
    )
}
