import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

export const cardBaseClassName = "rounded-lg border border-border/60 bg-card text-card-foreground shadow-sm shadow-foreground/10"

interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean
}

const CardBase = React.forwardRef<HTMLDivElement, CardBaseProps>(
    ({ asChild = false, className, ...props }, ref) => {
        const Comp = asChild ? Slot : "div"

        return (
            <Comp
                ref={ref}
                className={cn(cardBaseClassName, className)}
                {...props}
            />
        )
    }
)

CardBase.displayName = "CardBase"

export default CardBase
