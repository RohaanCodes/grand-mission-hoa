import { NextRequest, NextResponse } from 'next/server'
import { getBoardMemberByToken } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/board/login', request.url))

  const boardMember = await getBoardMemberByToken(token)
  if (!boardMember) return NextResponse.redirect(new URL('/board/login?error=invalid', request.url))

  const response = NextResponse.redirect(new URL('/board', request.url))
  response.cookies.set('board_token', boardMember.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}