import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  const hasSession = session && session !== 'undefined'

  // If the user is trying to access protected routes (/main/*) and has no session
  if (request.nextUrl.pathname.startsWith('/main') && !hasSession) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If the user is at the login page (/) and already has a session
  if (request.nextUrl.pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/main/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/main/:path*'],
}
