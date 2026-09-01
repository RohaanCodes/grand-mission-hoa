import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/profile/login', request.url))
  response.cookies.delete('resident_token')
  return response
}