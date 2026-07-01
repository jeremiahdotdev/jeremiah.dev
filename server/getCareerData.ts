import { parseJobs } from './service/parseJobs';
import { getCareerContent } from '@/sanity/lib/getCareerContent';

export async function getCareerData(endDateDefault: string) { 
  const experiences = await getCareerContent()
  return parseJobs(experiences, endDateDefault) 
}
