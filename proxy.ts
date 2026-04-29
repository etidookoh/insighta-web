// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   const accessToken = request.cookies.get('access_token')?.value;
//   const { pathname } = request.nextUrl;

//   const publicPaths = ['/', '/auth/callback'];
//   if (publicPaths.includes(pathname)) return NextResponse.next();

//   if (!accessToken) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/profiles/:path*', '/search/:path*', '/account/:path*'],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};