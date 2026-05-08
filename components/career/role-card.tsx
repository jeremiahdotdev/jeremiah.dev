"use client"

import { Job } from "@/types/job"
import { FC, memo } from "react"
import { ComponentOf } from "../utility/componentOf"

interface RoleCardProps {
    role: Job
}

const RoleCard: FC<RoleCardProps> = ({role}: RoleCardProps) => (
    <article className="h-full rounded-lg border bg-card p-3 shadow-sm md:p-4">
        <div className="flex w-full flex-col gap-2 text-left">
            <span className="flex items-start justify-between gap-3">
                <span className="min-w-0 text-base font-semibold leading-tight md:text-lg">{role.title}</span>
                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{role.type}</span>
            </span>
            <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{role.startDate} - {role.endDate}</span>
                <span aria-hidden="true">·</span>
                <span>{role.duration}</span>
            </span>
        </div>
        <div className="mt-3 border-l-2 border-primary/20 pl-3 text-sm leading-5 text-muted-foreground md:pl-4 md:leading-6 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_li]:pl-1">
            <ComponentOf jsx={role.description}/>
        </div>
    </article>
)

export default memo(RoleCard)
