"use client"
import { FC, ReactNode } from 'react'

export interface BaseProps {
    children: ReactNode | ReactNode[],
}

export const Skeletons: FC<BaseProps> = ({children}: BaseProps) => {
    if (typeof window !== "undefined") {
        return null
    }

    return children
}
