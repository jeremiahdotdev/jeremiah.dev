import { parseJobs } from './service/parseJobs';
import { getSiteDictionary } from '@/sanity/lib/getSiteSettings';
import { getCareerContent } from '@/sanity/lib/getCareerContent';

export async function getCareerData() { 
  const $t = await getSiteDictionary()
  const experiences = await getCareerContent()
  return parseJobs(experiences, $t.timeline.endDateDefault) 
}
