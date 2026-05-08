import { Academics } from "@/types/academics"
import { FC, memo, useMemo } from "react"
import { HoverTooltip } from "../shared/hover-tooltip"

interface AcademicSummaryCardProps {
    academics: Academics
    institutionHref: string
}

const AcademicSummaryCard: FC<AcademicSummaryCardProps> = ({ academics, institutionHref }: AcademicSummaryCardProps) => {
    const endYear = academics.endDate.split(" ").at(-1) ?? academics.endDate

    const component = useMemo(() => (
        <header className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:p-5">
            <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <span className="flex flex-col">
                    <h2 className="text-2xl font-semibold leading-tight">{academics.degree}</h2>
                    <HoverTooltip tooltip={institutionHref} className="w-fit">
                        <a href={institutionHref} className="text-sm text-muted-foreground hover:underline">
                            {academics.institution} · {academics.location}
                        </a>
                    </HoverTooltip>
                </span>
                <span className="text-base font-semibold text-foreground sm:text-lg">{endYear}</span>
            </span>
            <div className="border-l-2 border-primary/20 pl-3 text-sm leading-5 text-muted-foreground md:pl-4 md:leading-6">
                {academics.description}
            </div>
        </header>
    ), [academics, endYear, institutionHref])

    return component
}

export default memo(AcademicSummaryCard)
