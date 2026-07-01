import { Commendation as CommendationType } from "@/types/commendation"
import CardBase from "../shared/card-base"

interface CommendationProps {
    commendation: CommendationType
}

export default function Commendation({ commendation }: CommendationProps) {
    const content = (
        <>
            <span className="flex aspect-square w-10 shrink-0 items-center justify-center [&_svg]:h-10 [&_svg]:w-10">
                {commendation.image}
            </span>
            <span className="flex w-fullflex-col gap-1">
                <span className="flex w-full items-center gap-2 justify-between">
                    <span className="text-md font-bold leading-tight">{commendation.title}</span>
                    <span className="truncate text-xs font-semibold text-muted-foreground">({commendation.dates})</span>
                </span>
                <span className="truncate text-sm text-muted-foreground">{commendation.subtitle}</span>
            </span>
        </>
    )

    return commendation.link ? (
        <CardBase asChild className="flex min-w-0 items-center gap-3 p-3 transition-colors hover:bg-muted">
            <a href={commendation.link} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        </CardBase>
    ) : (
        <CardBase className="flex min-w-0 items-center gap-3 p-3">
            {content}
        </CardBase>
    )
}
