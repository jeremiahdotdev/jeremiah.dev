import { getLanguagesData } from '@/server/getLanguagesData'
import { NextResponse } from 'next/server'
 
export async function GET() {
  const data = await getLanguagesData()
  return NextResponse.json(data)
}