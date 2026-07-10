import { parseAcademia } from '@/server/service/parseAcademics';
import { getAcademicContent } from '@/sanity/lib/getAcademicContent';

export async function getAcademicData(endDateDefault: string) { 
  const academics = await getAcademicContent()
  return parseAcademia(academics, endDateDefault) 
}
