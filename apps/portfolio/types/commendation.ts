import { ReactNode } from "react"

export type Commendation = {
    title: string,
    subtitle: string,
    label?: string,
    focusKey?: string,
    tooltip?: string,
    dates: string,
    link?: string,
    image: ReactNode
}
