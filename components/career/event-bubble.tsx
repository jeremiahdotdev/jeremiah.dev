import { FC, memo, useMemo } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { TypographyH3, TypographySmall } from "@/components/ui/typography"
interface EventBubble {
    heading: string
    subheading: string
    showRightArrow: boolean
    showLeftArrow: boolean
}

const EventBubble: FC<EventBubble> = ({heading, subheading, showLeftArrow, showRightArrow}: EventBubble) => {
    const component = useMemo(() => (
        <span className="flex items-center justify-center">
            { showLeftArrow && <ChevronLeft className="sm:hidden"/> }
            <button className="rounded-full bg-lime-400/80 px-4 py-2">
                <TypographyH3 text={heading} />
                <TypographySmall asChild>
                    <span>{subheading}</span>
                </TypographySmall>
            </button>
            { showRightArrow && <ChevronRight className="sm:hidden"/> }
        </span>
    ), [showLeftArrow, showRightArrow, heading, subheading])

    return component
}

export default memo(EventBubble)
