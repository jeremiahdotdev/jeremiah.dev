import { ReactNode } from "react"

export type Commendation = {
    title: string,
    subtitle: string,
    tooltip?: string,
    dates: string,
    link?: string,
    image: ReactNode
}
