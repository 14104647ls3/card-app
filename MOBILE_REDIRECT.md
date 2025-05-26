# Mobile Redirect Functionality

This document explains how the mobile device detection and redirect functionality works in the application.

## Overview

The application automatically redirects users on mobile and tablet devices from `/responses` to `/responses/mobile` to provide an optimized mobile experience.

## Implementation

### Server-Side Detection (Middleware)

The redirect is implemented using Next.js middleware (`middleware.ts`) which runs on the server before the page loads:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { isMobileOrTabletUserAgent } from './src/lib/userAgent';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/responses') {
    const userAgent = request.headers.get('user-agent') || '';
    
    if (isMobileOrTabletUserAgent(userAgent)) {
      const url = request.nextUrl.clone();
      url.pathname = '/responses/mobile';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}
```

### User Agent Detection

The detection logic checks for common mobile and tablet keywords in the user agent string:

- `android`
- `webos` 
- `iphone`
- `ipad`
- `ipod`
- `blackberry`
- `iemobile`
- `opera mini`
- `mobile`
- `tablet`

## Routes

- **`/responses`** - Desktop version with sidebar layout
- **`/responses/mobile`** - Mobile-optimized version with collapsible sidebar

## Testing

### Method 1: Browser Developer Tools

1. Open browser developer tools (F12)
2. Find device emulation/responsive design mode
3. Select a mobile device (iPhone, iPad, Android, etc.)
4. Navigate to `/responses`
5. You should be automatically redirected to `/responses/mobile`

### Method 2: Test Page

Visit `/test-redirect` to:
- See your current user agent and detection result
- Test custom user agent strings
- Try sample mobile user agents

### Method 3: Manual Testing

Use different devices or browsers with mobile user agents to test the redirect functionality.

## Benefits

- ✅ **Server-side detection** - Fast, no client-side JavaScript needed
- ✅ **SEO friendly** - Proper HTTP redirects
- ✅ **No flash of wrong content** - Redirect happens before page load
- ✅ **Automatic** - No user interaction required
- ✅ **Reliable** - Based on standard user agent patterns

## Troubleshooting

If the redirect isn't working:

1. Check that `middleware.ts` is in the project root
2. Verify the user agent contains mobile/tablet keywords
3. Test with `/test-redirect` page to debug detection
4. Check browser network tab for redirect responses
5. Ensure Next.js middleware is enabled in your deployment

## User Agent Examples

**Mobile (will redirect):**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1
```

**Desktop (will not redirect):**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
``` 