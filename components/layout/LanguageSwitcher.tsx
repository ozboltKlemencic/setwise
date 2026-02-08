'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
    const pathname = usePathname() || '/'
    const router = useRouter()

    const isSlovenian = pathname.startsWith('/sl')
    const currentLocale = isSlovenian ? 'SL' : 'EN'

    let otherLocalePath: string
    if (isSlovenian) {
        otherLocalePath = pathname.replace(/^\/sl/, '') || '/'
    } else {
        otherLocalePath = `/sl${pathname === '/' ? '' : pathname}`
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        router.push(otherLocalePath)
    }

    return (
        <a
            href={otherLocalePath}
            onClick={handleClick}
            className="size-(--space-9) flex items-center justify-center duration-(--duration-normal) rounded-full text-[10px] md:text-xs font-medium transition-all text-muted-foreground hover:text-foreground border border-border/60 hover:border-border shadow-(--shadow-xs) backdrop-blur-(--blur-medium) bg-linear-to-tr from-surface-100 to-surface-200/80 hover:from-surface-200/80 hover:to-surface-100 hover:ring-2 hover:ring-offset-1 ring-offset-background hover:ring-border/80 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border/80 focus:scale-95 transform-gpu will-change-transform"
        >
            {currentLocale}
        </a>
    )
}
