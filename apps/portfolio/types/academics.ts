import { ReactNode } from "react"
import { Commendation } from "./commendation"
import { Focus } from "./focus"

export type AcademicEmblem = {
    lightSrc: string,
    darkSrc: string,
    alt: string,
}

export type Academics = {
    degree: string,
    emblem?: AcademicEmblem,
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
    emblem?: AcademicEmblem,
    focuses: Focus[],
    description: ReactNode,
    institution: string,
    location: string,
    startDate: Date,
    endDate: Date,
    commendations: Commendation[]
}
