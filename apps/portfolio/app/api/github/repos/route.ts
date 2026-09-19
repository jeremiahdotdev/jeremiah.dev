import { getReposData } from '@/server/getReposData'
import { NextResponse } from 'next/server'
 
export async function GET() {
  const data = await getReposData()
  return NextResponse.json(data)
}