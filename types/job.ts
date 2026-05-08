import { Skill } from "./skill"

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
    location: string,
    roles: ImportedRole[]
}
