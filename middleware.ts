import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except:
    // - API routes
    // - Next.js internals (_next)
    // - Static files (images, fonts, etc.)
    // - Mobile deep-link callback route
    matcher: [
        // Match all pathnames except those starting with:
        '/((?!api|_next|_vercel|auth-callback|.*\\..*).*)',
        // Always run for root
        '/',
    ],
};
