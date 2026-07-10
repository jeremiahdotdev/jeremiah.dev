"use client"

import {
    ReactNode
} from "react"
import {
    Tooltip as TooltipBase,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type TooltipProps = {
    children: ReactNode | ReactNode[],
    tooltip: ReactNode | ReactNode[],
    className?: string,
    asChild?: boolean,
}

export function HoverTooltip({ children, tooltip, className, asChild = false }: TooltipProps) {
    return (
        <TooltipProvider>
            <TooltipBase>
                <TooltipTrigger
                    asChild={asChild}
                    className={cn("inline-flex min-h-6 min-w-11 items-center justify-center", className)}
                >
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {tooltip}
                </TooltipContent>
            </TooltipBase>
        </TooltipProvider>
    )
}
