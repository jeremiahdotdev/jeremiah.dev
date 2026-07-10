import { getReposData } from '@/server/getReposData'
import { NextResponse } from 'next/server'
 
export async function GET(request: Request) { 
  const data = await getReposData()
  return NextResponse.json(data)
}