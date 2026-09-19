import { getCareerExperience } from './service/getCareerExperience';
import { parseJobs } from './service/parseJobs';
import { getCareerContent } from '@/sanity/lib/getCareerContent';
import { getCareerSkills } from '@/sanity/lib/getCareerSkills';

export async function getCareerData(endDateDefault: string) {
  const [experiences, skills] = await Promise.all([getCareerContent(), getCareerSkills()])
  const jobs = parseJobs(experiences, endDateDefault)
  return {
    jobs,
    skills,
    experience: getCareerExperience(jobs),
  }
}
