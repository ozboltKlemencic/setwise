'use client'

import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
    const pathname = usePathname() || '/'

    // Detect current locale from URL
    // With English as default: no prefix = English, /sl prefix = Slovenian
    const isSlovenian = pathname.startsWith('/sl')
    const currentLocale = isSlovenian ? 'SL' : 'EN'

    // Calculate path for other locale
    let otherLocalePath: string
    if (isSlovenian) {
        // Remove /sl prefix to go to English (default)
        otherLocalePath = pathname.replace(/^\/sl/, '') || '/'
    } else {
        // Add /sl prefix to go to Slovenian
        otherLocalePath = `/sl${pathname === '/' ? '' : pathname}`
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        // Force full page navigation
        window.location.assign(otherLocalePath)
    }

    return (
        <a
            href={otherLocalePath}
            onClick={handleClick}
            className="py-2 px-2.5 duration-200 rounded-full text-xs font-medium transition-all hover:to-neutral-100 hover:from-neutral-200/80 text-gray-600 hover:text-neutral-800 border hover:border-neutral-300 border-neutral-200/60 shadow-xs backdrop-blur-md bg-linear-to-tr from-neutral-100 to-neutral-200/80 hover:ring-2 hover:ring-offset-1 hover:ring-neutral-200/80 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-200/80 focus:scale-95 transform-gpu will-change-transform"
        >
            {currentLocale}
        </a>
    )
}
