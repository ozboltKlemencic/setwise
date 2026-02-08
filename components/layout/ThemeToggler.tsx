'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const btnClass = "size-(--space-9) flex items-center justify-center duration-(--duration-normal) rounded-full text-[10px] md:text-xs font-medium transition-all text-muted-foreground hover:text-foreground border border-border/60 hover:border-border shadow-(--shadow-xs) backdrop-blur-(--blur-medium) bg-linear-to-tr from-surface-100 to-surface-200/80 hover:from-surface-200/80 hover:to-surface-100 hover:ring-2 hover:ring-offset-1 ring-offset-background hover:ring-border/80 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border/80 focus:scale-95 transform-gpu will-change-transform"

export default function ThemeToggler() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    if (!mounted) {
        return (
            <button className={btnClass} aria-label="Toggle theme">
                <Sun className="size-3.5 md:size-4" />
            </button>
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            className={btnClass}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Moon className="size-3.5 md:size-4" />
            ) : (
                <Sun className="size-3.5 md:size-4" />
            )}
        </button>
    )
}
