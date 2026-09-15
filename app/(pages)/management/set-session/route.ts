import { NextRequest, NextResponse } from 'next/server'
import { getManagementByToken } from '@/lib/airtable'

// Email security gateways (e.g. Proofpoint URL Defense) rewrite links for
// click-time scanning, and the redirect back to the real URL can corrupt
// or append trailing characters to the query string. The token itself is
// always a clean UUID, so pull out just that instead of trusting whatever
// comes through after "token=" verbatim.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export async function GET(request: NextRequest) {
  const rawToken = request.nextUrl.searchParams.get('token')
  if (!rawToken) return NextResponse.redirect(new URL('/management/login', request.url))

  const match = rawToken.match(UUID_PATTERN)
  const token = match ? match[0] : rawToken

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