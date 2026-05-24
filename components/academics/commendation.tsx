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
            <span className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-semibold leading-tight">{commendation.title}</span>
                <span className="truncate text-xs text-muted-foreground">{commendation.subtitle}</span>
                <span className="text-xs font-medium text-muted-foreground">{commendation.dates}</span>
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
