import { academics as fallbackAcademics } from '@/data/academics'
import { ImportedAcademics } from '@/types/academics'
import Image from 'next/image'
import { client } from '../client'
import { hasSanityConfig } from '../env'
import { academicRecordQuery } from '../queries'
import { getCommendationIcon } from './iconMaps'
import { PortableTextValue, renderPortableText } from './portableText'

type SanityAcademicRecord = {
  degree?: string
  emblem?: {
    lightSrc?: string
    darkSrc?: string
    alt?: string
  }
  institution?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: PortableTextValue
  focuses?: Array<{
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
    <Image
      src={iconUrl}
      alt={focus.name ? `${focus.name} icon` : ''}
      width={48}
      height={48}
      className="h-12 w-12"
      unoptimized
      loading="lazy"
    />
  ) : undefined
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
      emblem: {
        lightSrc: record.emblem?.lightSrc || fallbackAcademics.emblem?.lightSrc || '',
        darkSrc: record.emblem?.darkSrc || fallbackAcademics.emblem?.darkSrc || '',
        alt: record.emblem?.alt || fallbackAcademics.emblem?.alt || '',
      },
      institution: record.institution || '',
      location: record.location || '',
      startDate: toDate(record.startDate),
      endDate: toDate(record.endDate),
      description: renderPortableText(record.description) || null,
      focuses: (record.focuses || []).map((focus) => ({
        type: focus.type || '',
        name: focus.name || '',
        gpa: focus.gpa || '',
        icon: toFocusIcon(focus),
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
