import React, { FC, memo, useMemo } from "react"
import { Focus as FocusType} from "@/types/focus"
import CardBase from "../shared/card-base"

interface FocusProps {
    focus: FocusType,
    gpaLabel: string,
}

const Focus: FC<FocusProps> = ({ focus, gpaLabel }: FocusProps) => {
    const component = useMemo(() => (
        <CardBase asChild className="h-full border-border/70 bg-card/95 p-5 shadow-sm shadow-foreground/10 backdrop-blur-sm md:p-6">
        <article className="flex h-full flex-col">
            <div className="flex flex-col gap-2 text-left">
                <span className="flex items-start justify-between gap-4">
                    <span className="flex min-w-0 items-start gap-4">
                        {focus.icon ? (
                            <span
                                aria-hidden="true"
                                className="mt-1 flex size-12 shrink-0 items-center justify-center text-primary [&_svg]:h-10 [&_svg]:w-10 [&_svg]:stroke-[1.5]"
                            >
                                {focus.icon}
                            </span>
                        ) : null}
                        <span className="min-w-0">
                            <span className="block text-xl font-semibold leading-tight tracking-tight text-foreground md:text-2xl">{focus.name}</span>
                            <span className="mt-1 block text-base font-medium text-primary">{gpaLabel}: {focus.gpa}</span>
                        </span>
                    </span>
                    <span className="shrink-0 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground">{focus.type}</span>
                </span>
            </div>
            <div className="mt-5 flex-1 border-t border-border/70 pt-5 text-base leading-7 text-muted-foreground [&_p+_p]:mt-5">
                {focus.description}
            </div>
        </article>
        </CardBase>
    ), [focus, gpaLabel])

    return component
}

export default memo(Focus)
