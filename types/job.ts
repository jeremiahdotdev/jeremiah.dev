import { Skill } from "./skill"
import { Icon } from "./icon"

export type Job = {
    title: string, 
    type: string,
    employer: string,
    duration: string, 
    startDate: string,
    endDate: string,
    location: string,
    description: React.ReactNode,
    skills: Skill[]
}

export type CareerEvent = {
    employer: string,
    icon?: Icon,
    startDate: string,
    endDate: string,
    duration: string,
    location: string,
    roles: Job[]
}

export type ImportedRole = {
    title: string, 
    type: string,
    startDate: Date,
    endDate?: Date,
    description: React.ReactNode,
    skills: Skill[]
}

export type ImportedCareerEvent = {
    employer: string,
    icon?: Icon,
    location: string,
    roles: ImportedRole[]
}
