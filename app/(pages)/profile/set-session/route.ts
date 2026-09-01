import { NextRequest, NextResponse } from 'next/server'
import { getResidentByAccessToken } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/profile/login', request.url))
  }

  const resident = await getResidentByAccessToken(token)

  if (!resident) {
    return NextResponse.redirect(new URL('/profile/login?error=invalid', request.url))
  }

  const response = NextResponse.redirect(new URL('/profile', request.url))

  response.cookies.set('resident_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: '/',
  })

  return response
}