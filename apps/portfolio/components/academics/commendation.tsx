import { Commendation as CommendationType } from "@/types/commendation"
import CardBase from "../shared/card-base"

interface CommendationProps {
    commendation: CommendationType
}

export default function Commendation({ commendation }: CommendationProps) {
    const content = (
        <>
            <span className="flex aspect-square w-20 shrink-0 items-center justify-center [&_svg]:h-20 [&_svg]:w-20">
                {commendation.image}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-xl font-bold leading-tight">{commendation.title}</span>
                <span className="text-base leading-snug text-muted-foreground">{commendation.subtitle}</span>
                <span className="w-fit rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                    {commendation.dates}
                </span>
            </span>
        </>
    )

    return commendation.link ? (
        <CardBase asChild className="flex min-w-0 items-center gap-5 p-5 transition-colors hover:bg-muted md:p-6">
            <a href={commendation.link} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        </CardBase>
    ) : (
        <CardBase className="flex min-w-0 items-center gap-5 p-5 md:p-6">
            {content}
        </CardBase>
    )
}
