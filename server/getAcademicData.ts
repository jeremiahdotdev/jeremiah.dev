import { parseAcademia } from '@/server/service/parseAcademics';
import { getSiteDictionary } from '@/sanity/lib/getSiteSettings';
import { getAcademicContent } from '@/sanity/lib/getAcademicContent';

export async function getAcademicData() { 
  const $t = await getSiteDictionary()
  const academics = await getAcademicContent()
  return parseAcademia(academics, $t.timeline.endDateDefault) 
}
