import { Academics } from "@/types/academics"
import Image from "next/image"
import { FC, memo, useMemo } from "react"
import CardBase from "../shared/card-base"

interface AcademicSummaryCardProps {
    academics: Academics
    institutionHref: string
}

const AcademicSummaryCard: FC<AcademicSummaryCardProps> = ({ academics, institutionHref }: AcademicSummaryCardProps) => {
    const endYear = academics.endDate.split(" ").at(-1) ?? academics.endDate
    const emblem = academics.emblem

    const component = useMemo(() => (
        <CardBase asChild className="p-4 md:p-5">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
            {emblem ? (
                <span className="relative flex min-h-32 shrink-0 items-center justify-center overflow-hidden sm:w-36 md:w-44">
                    <Image
                        src={emblem.lightSrc}
                        alt={emblem.alt}
                        width={176}
                        height={176}
                        className="h-full max-h-40 w-full object-contain dark:hidden md:max-h-44"
                    />
                    <Image
                        src={emblem.darkSrc}
                        alt={emblem.alt}
                        width={176}
                        height={176}
                        className="hidden h-full max-h-40 w-full object-contain dark:block md:max-h-44"
                    />
                </span>
            ) : null}
            <span className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                <span className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <span className="flex w-full flex-col gap-1">
                        <span className="flex justify-between pr-4">
                            <h2 className="text-2xl font-semibold leading-tight tracking-tight">{academics.degree}</h2>
                            <span className="text-2xl font-semibold leading-tight tracking-tight">{endYear}</span>
                        </span>
                        <a
                            href={institutionHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-8 w-fit items-center text-md text-foreground hover:underline"
                        >
                            {academics.institution} · {academics.location}
                        </a>
                    </span>
                </span>
                <span className="max-w-3xl border-primary/20 text-md text-muted-foreground">
                    {academics.description}
                </span>
            </span>
        </header>
        </CardBase>
    ), [academics, emblem, endYear, institutionHref])

    return component
}

export default memo(AcademicSummaryCard)
