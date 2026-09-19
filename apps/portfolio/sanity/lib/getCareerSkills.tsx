import { groq } from 'next-sanity'
import { fallbackCareerSkills } from '@/data/featured-skills'
import type { Skill } from '@/types/skill'
import { client } from '../client'
import { hasSanityConfig } from '../env'
import { type SanitySkill, toSkill } from './skill'

const careerSkillsQuery = groq`*[_type == "siteSettings"][0]{
  careerSkills[]->{
    title,
    subtitle,
    tooltip,
    icon{asset->{url}},
    href
  }
}`

type CareerSkillsSettings = {
  careerSkills?: Array<SanitySkill | null> | null
}

export async function getCareerSkills(): Promise<Skill[]> {
  if (!hasSanityConfig) return fallbackCareerSkills

  try {
    const settings = await client.fetch<CareerSkillsSettings | null>(
      careerSkillsQuery,
      {},
      {next: {revalidate: 60}},
    )

    // An explicitly empty CMS list hides the carousel.
    if (!settings?.careerSkills) return fallbackCareerSkills

    return settings.careerSkills
      .filter((skill): skill is SanitySkill => skill !== null)
      .map(toSkill)
  } catch {
    return fallbackCareerSkills
  }
}
