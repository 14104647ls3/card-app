import { NextRequest, NextResponse } from 'next/server';
import { isMobileOrTabletUserAgent } from './lib/userAgent';

export function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.nextUrl.pathname);
  
  // Only apply middleware to the /responses route
  if (request.nextUrl.pathname === '/responses') {
    console.log('Processing /responses route');
    const userAgent = request.headers.get('user-agent') || '';
    console.log('User Agent:', userAgent);
    
    // Check if the user agent indicates a mobile or tablet device
    const isMobile = isMobileOrTabletUserAgent(userAgent);
    console.log('Is Mobile/Tablet:', isMobile);
    
    if (isMobile) {
      console.log('Redirecting to mobile version');
      // Redirect to mobile version
      const url = request.nextUrl.clone();
      url.pathname = '/responses/mobile';
      return NextResponse.redirect(url);
    }
    
    console.log('Continuing to desktop version');
  }
  
  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/responses',
    '/responses/'
  ]
}; 