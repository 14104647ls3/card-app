/**
 * Utility function to detect mobile and tablet devices from user agent string
 */
export function isMobileOrTabletUserAgent(userAgent: string): boolean {
  if (!userAgent) {
    console.log('No user agent provided');
    return false;
  }
  
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  const result = mobileRegex.test(userAgent);
  
  console.log('User Agent Detection:', {
    userAgent: userAgent.substring(0, 100) + '...', // Log first 100 chars
    regex: mobileRegex.toString(),
    result
  });
  
  return result;
}

/**
 * Common mobile/tablet user agent patterns for testing
 */
export const MOBILE_USER_AGENTS = {
  iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
  iPad: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
  Android: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  AndroidTablet: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36'
}; 