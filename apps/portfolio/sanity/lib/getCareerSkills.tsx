import { groq } from 'next-sanity'
import type { Skill } from '@/types/skill'
import { client } from '../client'
import { requireSanityConfig } from '../env'
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
  requireSanityConfig()

  const settings = await client.fetch<CareerSkillsSettings | null>(
    careerSkillsQuery,
    {},
    {next: {revalidate: 60}},
  )

  if (!settings) throw new Error('Sanity Site Settings is missing.')

  return (settings.careerSkills ?? [])
    .filter((skill): skill is SanitySkill => skill !== null)
    .map(toSkill)
}
