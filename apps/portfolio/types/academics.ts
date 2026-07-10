import { ReactNode } from "react"
import { Commendation } from "./commendation"
import { Focus } from "./focus"

export type Academics = {
    degree: string,
    focuses: Focus[],
    description: ReactNode,
    institution: string,
    location: string,
    startDate: string,
    endDate: string,
    duration: string,
    commendations: Commendation[]
}

export type ImportedAcademics = {
    degree: string,
    focuses: Focus[],
    description: ReactNode,
    institution: string,
    location: string,
    startDate: Date,
    endDate: Date,
    commendations: Commendation[]
}
