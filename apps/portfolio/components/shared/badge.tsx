import { ReactNode } from "react"
import { TypographySmall } from "@/components/ui/typography"
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
        <Root variant="outline" className="flex items-center justify-center gap-1 border-border/60 bg-card p-1 px-2 shadow-sm shadow-foreground/10 hover:bg-card/40">
            {badge.image && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-6 [&_svg]:w-6">
                    {badge.image}
                </span>
            )}
            <TypographySmall>
                {badge.subtitle}
            </TypographySmall>
        </Root>
    )
}
