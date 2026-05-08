import { getCareerData } from '@/server/getCareerData';
import { CareerEvent } from '@/types/job';
import { NextResponse } from 'next/server'

export async function GET(request: Request): Promise<NextResponse<CareerEvent[]>> {
  const data = await getCareerData()
  return NextResponse.json(data)
}
