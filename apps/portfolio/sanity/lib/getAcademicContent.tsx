import AcademicFocusIcon from '@/components/academics/academic-focus-icon'
import { ImportedAcademics } from '@/types/academics'
import { client } from '../client'
import { requireSanityConfig } from '../env'
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
    _key: string
    type?: string
    name?: string
    gpa?: string
    icon?: {
      asset?: {
        url?: string
      }
    }
    description?: PortableTextValue
  }>
  commendations?: Array<{
    title?: string
    subtitle?: string
    label?: string
    focusKey?: string
    tooltip?: string
    dates?: string
    iconKey?: string
    link?: string
  }>
}

function toDate(date?: string) {
  return date ? new Date(`${date}T00:00:00`) : new Date()
}

function toFocusIcon(focus: {name?: string, icon?: {asset?: {url?: string}}}) {
  const iconUrl = focus.icon?.asset?.url

  return iconUrl ? (
    <AcademicFocusIcon
      src={iconUrl}
      alt={focus.name ? `${focus.name} icon` : ''}
      unoptimized
    />
  ) : undefined
}

export async function getAcademicContent(): Promise<ImportedAcademics> {
  requireSanityConfig()

  const record = await client.fetch<SanityAcademicRecord | null>(
    academicRecordQuery,
    {},
    {next: {revalidate: 60}},
  )

  if (!record) throw new Error('Sanity academic record is missing.')

  return {
    degree: record.degree || '',
    institution: record.institution || '',
    location: record.location || '',
    startDate: toDate(record.startDate),
    endDate: toDate(record.endDate),
    description: renderPortableText(record.description) || null,
    focuses: (record.focuses || []).map((focus) => ({
      key: focus._key,
      type: focus.type || '',
      name: focus.name || '',
      gpa: focus.gpa || '',
      icon: toFocusIcon(focus),
      description: renderPortableText(focus.description) || null,
    })),
    commendations: (record.commendations || []).map((commendation) => ({
      title: commendation.title || '',
      subtitle: commendation.subtitle || '',
      label: commendation.label,
      focusKey: commendation.focusKey,
      tooltip: commendation.tooltip,
      dates: commendation.dates || '',
      link: commendation.link,
      image: getCommendationIcon(commendation.iconKey),
    })),
  }
}
