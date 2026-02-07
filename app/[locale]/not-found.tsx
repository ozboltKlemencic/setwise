import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
    const t = useTranslations('NotFound')

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F5F3] px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-neutral-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-neutral-700 mb-2">{t('title')}</h2>
                <p className="text-neutral-500 mb-8">{t('description')}</p>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    {t('backHome')}
                </Link>
            </div>
        </div>
    )
}
