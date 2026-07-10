import { academics as fallbackAcademics } from '@/data/academics'
import { ImportedAcademics } from '@/types/academics'
import { client } from '../client'
import { hasSanityConfig } from '../env'
import { academicRecordQuery } from '../queries'
import { getCommendationIcon } from './iconMaps'
import { PortableTextValue, renderPortableText } from './portableText'

type SanityAcademicRecord = {
  degree?: string
  institution?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: PortableTextValue
  focuses?: Array<{
    type?: string
    name?: string
    gpa?: string
    description?: PortableTextValue
  }>
  commendations?: Array<{
    title?: string
    subtitle?: string
    tooltip?: string
    dates?: string
    iconKey?: string
    link?: string
  }>
}

function toDate(date?: string) {
  return date ? new Date(`${date}T00:00:00`) : new Date()
}

export async function getAcademicContent(): Promise<ImportedAcademics> {
  if (!hasSanityConfig) return fallbackAcademics

  try {
    const record = await client.fetch<SanityAcademicRecord | null>(
      academicRecordQuery,
      {},
      {next: {revalidate: 60}},
    )

    if (!record) return fallbackAcademics

    return {
      degree: record.degree || '',
      institution: record.institution || '',
      location: record.location || '',
      startDate: toDate(record.startDate),
      endDate: toDate(record.endDate),
      description: renderPortableText(record.description) || null,
      focuses: (record.focuses || []).map((focus) => ({
        type: focus.type || '',
        name: focus.name || '',
        gpa: focus.gpa || '',
        description: renderPortableText(focus.description) || null,
      })),
      commendations: (record.commendations || []).map((commendation) => ({
        title: commendation.title || '',
        subtitle: commendation.subtitle || '',
        tooltip: commendation.tooltip,
        dates: commendation.dates || '',
        link: commendation.link,
        image: getCommendationIcon(commendation.iconKey),
      })),
    }
  } catch {
    return fallbackAcademics
  }
}
