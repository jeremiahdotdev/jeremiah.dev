import { experiences as fallbackExperiences } from '@/data/career'
import { ImportedCareerEvent } from '@/types/job'
import { Skill } from '@/types/skill'
import { client } from '../client'
import { hasSanityConfig } from '../env'
import { careerEmployersQuery } from '../queries'
import { getSkillIcon } from './iconMaps'
import { PortableTextValue, renderPortableText } from './portableText'

type SanitySkill = {
  title?: string
  subtitle?: string
  tooltip?: string
  iconKey?: string
  href?: string
}

type SanityCareerEmployer = {
  name?: string
  location?: string
  roles?: Array<{
    title?: string
    employmentType?: string
    startDate?: string
    endDate?: string
    description?: PortableTextValue
    skills?: SanitySkill[]
  }>
}

function toSkill(skill: SanitySkill): Skill {
  return {
    subtitle: skill.subtitle || skill.title || '',
    tooltip: skill.tooltip,
    image: getSkillIcon(skill.iconKey),
    href: skill.href || '#',
  }
}

function toDate(date?: string) {
  return date ? new Date(`${date}T00:00:00`) : undefined
}

export async function getCareerContent(): Promise<ImportedCareerEvent[]> {
  if (!hasSanityConfig) return fallbackExperiences

  try {
    const employers = await client.fetch<SanityCareerEmployer[]>(
      careerEmployersQuery,
      {},
      {next: {revalidate: 60}},
    )

    if (!employers?.length) return fallbackExperiences

    return employers.map((employer) => ({
      employer: employer.name || '',
      location: employer.location || '',
      roles: (employer.roles || []).map((role) => ({
        title: role.title || '',
        type: role.employmentType || '',
        startDate: toDate(role.startDate) || new Date(),
        endDate: toDate(role.endDate),
        description: renderPortableText(role.description) || null,
        skills: (role.skills || []).map(toSkill),
      })),
    }))
  } catch {
    return fallbackExperiences
  }
}
