import { NextRequest, NextResponse } from 'next/server';

const COOKIE_STAFF = 'devi_auth_staff_session';
const COOKIE_RESIDENT = 'devi_auth_resident_session';

interface DecodedSession {
  type: string;
  role?: string;
  exp?: number;
}

/**
 * Lightweight, Edge-compatible base64url JSON decoder.
 */
function decodeSessionPayload(token: string): DecodedSession | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const b64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(b64);
    const payload = JSON.parse(json) as DecodedSession;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Admin Portal routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(COOKIE_STAFF)?.value;
    const session = token ? decodeSessionPayload(token) : null;

    if (!session || session.type !== 'staff') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-specific route boundaries: Wardens cannot access financial ledgers
    if (session.role === 'warden' && pathname.startsWith('/admin/finances')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 2. Protect Resident Portal routes (except /resident/login)
  if (pathname.startsWith('/resident') && !pathname.startsWith('/resident/login')) {
    const token = request.cookies.get(COOKIE_RESIDENT)?.value;
    const session = token ? decodeSessionPayload(token) : null;

    if (!session || session.type !== 'resident') {
      const loginUrl = new URL('/resident/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/resident/:path*',
  ],
};
