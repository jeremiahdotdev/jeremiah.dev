"use client"
import React, { FC, ReactNode, memo, useMemo } from "react"
import { Badge as Root } from "@/components/ui/badge"
import { ComponentOf } from "../utility/componentOf"

export type Badging = {
    subtitle?: string,
    image?: ReactNode,
    href?: string,
}

interface BadgeProps {
    badge: Badging
}

const Badge: FC<BadgeProps> = ({ badge }: BadgeProps) => {  
    const component = useMemo(() => (
        <Root variant="outline" className={`flex items-center bg-card justify-center gap-2 p-1 border-foreground/20 shadow-sm shadow-fororeground/20`}>
            { badge.image && <ComponentOf jsx={badge.image} style="w-4 h-4" />}
            <p>    
                {badge.subtitle}
            </p>
        </Root>
    ), [badge])

    return component
}

export default memo(Badge)