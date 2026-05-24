"use client"

import { FC, memo } from "react"
import { TypographyLarge, TypographySmall, TypographyMuted } from "@/components/ui/typography"
import CardBase from "../shared/card-base"
import type { ClientJob } from "./timeline"

interface RoleCardProps {
    role: ClientJob
}

const RoleCard: FC<RoleCardProps> = ({role}: RoleCardProps) => (
    <CardBase asChild className="h-full p-3 md:p-4">
        <article>
            <div className="flex w-full flex-col gap-2 text-left">
                <span className="flex items-start justify-between gap-3">
                    <TypographyLarge asChild className="min-w-0 text-base leading-tight md:text-lg">
                        <span>{role.title}</span>
                    </TypographyLarge>
                    <TypographySmall asChild className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        <span>{role.type}</span>
                    </TypographySmall>
                </span>
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <TypographyMuted asChild className="text-xs">
                        <span>{role.startDate} - {role.endDate}</span>
                    </TypographyMuted>
                    <span aria-hidden="true">·</span>
                    <TypographyMuted asChild className="text-xs">
                        <span>{role.duration}</span>
                    </TypographyMuted>
                </span>
            </div>
            <div className="mt-3 border-l-2 border-primary/20 pl-3 text-sm leading-5 text-muted-foreground md:pl-4 md:leading-6 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_li]:pl-1">
                {role.description}
            </div>
        </article>
    </CardBase>
)

export default memo(RoleCard)
