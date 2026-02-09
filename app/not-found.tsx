import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import NotFoundContent from '@/components/not-found-content'

// Root 404 page - Static (no translations/provider guaranteed)
export default async function NotFound() {
    // Provide English messages for the root 404
    const messages = await getMessages({ locale: 'en' })

    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            <NotFoundContent />
        </NextIntlClientProvider>
    )
}

