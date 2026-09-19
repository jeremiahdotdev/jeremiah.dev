import { getDurationBetweenDates } from "./getDurationBetweenDates";
import { Academics, ImportedAcademics } from "@/types/academics";


export function parseAcademia(academics: ImportedAcademics, endDateDefault: string): Academics {
    const parseDate = (date: Date) => date.toLocaleString('default', { month: 'short', year: 'numeric' })
    
    const parsedAcademics: Academics = {
        ...academics,
        startDate: parseDate(academics.startDate),
        endDate: academics.endDate ? parseDate(academics.endDate) : endDateDefault,
        duration: getDurationBetweenDates(academics.startDate, academics.endDate ?? new Date())
    }
    return parsedAcademics
}
