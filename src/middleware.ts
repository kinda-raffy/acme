import {NextResponse, type NextRequest} from 'next/server';

const isAuthenticated = (request: NextRequest): boolean => {
  const userId = request.cookies.get('userId')?.value;
  return Boolean(userId);
};

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthenticatedUser = isAuthenticated(request);

  if (!isAuthenticatedUser && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticatedUser && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
