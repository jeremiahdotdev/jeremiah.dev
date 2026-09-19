import type { Skill } from '@/types/skill'
import Image from 'next/image'

export type SanitySkill = {
  title?: string
  subtitle?: string
  tooltip?: string
  href?: string
  icon?: {
    asset?: {
      url?: string
    }
  }
}

export function toSkill(skill: SanitySkill): Skill {
  const iconUrl = skill.icon?.asset?.url

  return {
    subtitle: skill.subtitle || skill.title || '',
    tooltip: skill.tooltip,
    image: iconUrl ? (
      <Image
        src={iconUrl}
        alt={skill.subtitle || skill.title || ''}
        className="h-4 w-4"
        width={16}
        height={16}
        unoptimized
        loading="lazy"
      />
    ) : undefined,
    href: skill.href || '#',
  }
}
