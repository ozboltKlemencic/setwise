import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import NotFoundContent from '@/components/not-found-content'

// Locale 404 page - renders outside locale layout
export default async function NotFound() {
    // We can default to English or try to handle locale if possible.
    // Since this file doesn't get params, defaulting to 'en' is the safest quick fix 
    // to prevent crashes. For true localization here, more complex setup is needed.
    const messages = await getMessages({ locale: 'en' })

    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            <NotFoundContent />
        </NextIntlClientProvider>
    )
}

