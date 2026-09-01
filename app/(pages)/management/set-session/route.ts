import { NextRequest, NextResponse } from 'next/server'
import { getManagementByToken } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/management/login', request.url))

  const mgmt = await getManagementByToken(token)
  if (!mgmt) return NextResponse.redirect(new URL('/management/login?error=invalid', request.url))

  const response = NextResponse.redirect(new URL('/management', request.url))
  response.cookies.set('mgmt_token', mgmt.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}