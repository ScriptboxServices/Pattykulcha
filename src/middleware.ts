import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;

  if (pathname === '/api/webhook') {
    return NextResponse.next();
  }
  const xToken = req.headers.get('x-Token');

  if (!xToken) {
    return NextResponse.json(
      {
        code: 0,
        message: 'Unauthorized User',
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: [
    '/api/:path*',
  ]
};
