import { CareerEvent, ImportedCareerEvent, ImportedRole, Job } from "@/types/job";
import { getDurationBetweenDates } from "./getDurationBetweenDates";

export function parseJob(job: ImportedRole, employer: string, location: string, endDateDefault: string): Job {
    const parseDate = (date: Date) => date.toLocaleString('default', { month: 'short', year: 'numeric' })
    const parsedJob: Job = {
        ...job,
        employer,
        location,
        startDate: parseDate(job.startDate),
        endDate: job.endDate ? parseDate(job.endDate) : endDateDefault,
        duration: getDurationBetweenDates(job.startDate, job.endDate ?? new Date())
    }
    return parsedJob
}

export function parseCareerEvent(event: ImportedCareerEvent, endDateDefault: string): CareerEvent {
    const roles = event.roles.map((role) => parseJob(role, event.employer, event.location, endDateDefault))
    const sortedRoles = [...event.roles].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    const startDate = sortedRoles[0]?.startDate ?? new Date()
    const hasCurrentRole = event.roles.some((role) => !role.endDate)
    const endDate = hasCurrentRole
        ? undefined
        : event.roles
            .map((role) => role.endDate)
            .filter((date): date is Date => Boolean(date))
            .sort((a, b) => b.getTime() - a.getTime())[0]
    const parseDate = (date: Date) => date.toLocaleString('default', { month: 'short', year: 'numeric' })
    const parseYear = (date: Date) => date.getFullYear().toString()

    return {
        employer: event.employer,
        icon: event.icon,
        location: event.location,
        roles,
        startDate: parseDate(startDate),
        endDate: endDate ? parseDate(endDate) : endDateDefault,
        startYear: parseYear(startDate),
        endYear: endDate ? parseYear(endDate) : endDateDefault,
        duration: getDurationBetweenDates(startDate, endDate ?? new Date())
    }
}

export function parseJobs(events: ImportedCareerEvent[], endDateDefault: string): CareerEvent[] {
    return events.map((event) => parseCareerEvent(event, endDateDefault))
}
