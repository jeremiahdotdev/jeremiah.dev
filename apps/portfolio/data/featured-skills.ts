import type { Skill } from "@/types/skill";
import { experiences } from "./career";
import featuredSkillsData from "./featured-skills.json";

const featuredSkills: Skill[] = featuredSkillsData;

const roleSkills = experiences
  .flatMap(({ roles }) => roles)
  .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
  .flatMap(({ skills }) => skills);

// Used only when the CMS list is unavailable, never merged into CMS content.
export const fallbackCareerSkills = [...featuredSkills, ...roleSkills].filter(
  (skill, index, skills) => skills.findIndex(({ subtitle }) => subtitle === skill.subtitle) === index,
);
