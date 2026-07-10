import { getProjectsData } from '@/server/getProjectsData'
import { NextResponse } from 'next/server'
 
export async function GET(request: Request) { 
  const data = await getProjectsData()
  return NextResponse.json(data)
}