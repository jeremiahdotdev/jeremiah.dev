import { ImportedCareerEvent } from '@/types/job'
import { client } from '../client'
import { requireSanityConfig } from '../env'
import { careerEmployersQuery } from '../queries'
import { PortableTextValue, renderPortableText } from './portableText'
import { type SanitySkill, toSkill } from './skill'

type SanityCareerEmployer = {
  name?: string
  location?: string
  icon?: {
    asset?: {
      url?: string
    }
  }
  roles?: Array<{
    title?: string
    employmentType?: string
    startDate?: string
    endDate?: string
    summary?: string
    description?: PortableTextValue
    skills?: Array<SanitySkill | null> | null
  }>
}

function toDate(date?: string) {
  return date ? new Date(`${date}T00:00:00`) : undefined
}

export async function getCareerContent(): Promise<ImportedCareerEvent[]> {
  requireSanityConfig()

  const employers = await client.fetch<SanityCareerEmployer[] | null>(
    careerEmployersQuery,
    {},
    {next: {revalidate: 60}},
  )

  if (employers == null) throw new Error('Sanity career query returned no result.')

  return employers.map((employer) => ({
    employer: employer.name || '',
    icon: employer.icon?.asset?.url ? {
      src: employer.icon.asset.url,
      alt: employer.name || '',
    } : undefined,
    location: employer.location || '',
    roles: (employer.roles || []).map((role) => ({
      title: role.title || '',
      type: role.employmentType || '',
      startDate: toDate(role.startDate) || new Date(),
      endDate: toDate(role.endDate),
      summary: role.summary,
      description: renderPortableText(role.description) || null,
      skills: (role.skills || [])
        .filter((skill): skill is SanitySkill => skill !== null)
        .map(toSkill),
    })),
  }))
}
