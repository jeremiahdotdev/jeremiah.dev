import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
  const data = { status: 200, timestamp: new Date(), owner: "Jeremiah D. Gage" }
 
  return NextResponse.json({ data })
}