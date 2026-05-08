import React, { FC, memo, useMemo } from "react"
import { Commendation as CommendationType } from "@/types/commendation"
import { ComponentOf } from "../utility/componentOf"
import CardBase from "../shared/card-base"

interface CommendationProps {
    commendation: CommendationType
}

const Commendation: FC<CommendationProps> = ({ commendation }: CommendationProps) => {
    const content = useMemo(() => (
            <>
                <ComponentOf jsx={commendation.image} style="aspect-square w-10 shrink-0" />
                <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-semibold leading-tight">{commendation.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{commendation.subtitle}</span>
                    <span className="text-xs font-medium text-muted-foreground">{commendation.dates}</span>
                </span>
            </>
    ), [commendation])

    const component = useMemo(() => commendation.link ? (
        <CardBase asChild className="flex min-w-0 items-center gap-3 p-3 transition-colors hover:bg-muted">
        <a href={commendation.link}>
            {content}
        </a>
        </CardBase>
    ) : (
        <CardBase className="flex min-w-0 items-center gap-3 p-3">
            {content}
        </CardBase>
    ), [commendation, content])

    return component
}

export default memo(Commendation)
