import React, { FC, memo, useMemo } from "react"
import { Focus as FocusType} from "@/types/focus"
import CardBase from "../shared/card-base"

interface FocusProps {
    focus: FocusType,
    gpaLabel: string,
}

const Focus: FC<FocusProps> = ({ focus, gpaLabel }: FocusProps) => {
    const component = useMemo(() => (
        <CardBase asChild className="h-full p-3 md:p-4">
        <article>
            <div className="flex flex-col gap-2 text-left">
                <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0 text-base font-semibold leading-tight md:text-lg">{focus.name}</span>
                    <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{focus.type}</span>
                </span>
                <span className="text-xs font-medium text-muted-foreground">{gpaLabel} {focus.gpa}</span>
            </div>
            <div className="mt-3 border-l-2 border-primary/20 pl-3 text-sm leading-5 text-muted-foreground md:pl-4 md:leading-6 [&_p+_p]:mt-3">
                {focus.description}
            </div>
        </article>
        </CardBase>
    ), [focus, gpaLabel])

    return component
}

export default memo(Focus)
