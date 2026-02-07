import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request (set by middleware)
    let locale = await requestLocale;

    // Validate that the locale is supported, fallback to default
    if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,

        // Locale-specific formatting
        timeZone: 'Europe/Ljubljana',

        formats: {
            dateTime: {
                short: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                },
                long: {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                },
            },
            number: {
                precise: {
                    maximumFractionDigits: 2,
                },
            },
        },
    };
});
