'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggler() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <button
                className="size-9 flex items-center justify-center duration-200 rounded-full text-[10px] md:text-xs font-medium transition-all hover:to-neutral-100 hover:from-neutral-200/80 text-gray-600 hover:text-neutral-800 dark:text-surface-400 dark:hover:text-surface-200 border hover:border-neutral-300 border-neutral-200/60 dark:border-surface-300/40 dark:hover:border-surface-300/60 shadow-xs backdrop-blur-md bg-linear-to-tr from-neutral-100 to-neutral-200/80 dark:from-surface-200 dark:to-surface-300/60 hover:ring-2 hover:ring-offset-1 hover:ring-neutral-200/80 dark:hover:ring-surface-400/40 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-200/80 focus:scale-95 transform-gpu will-change-transform"
                aria-label="Toggle theme"
            >
                <Sun className="size-3.5 md:size-4" />
            </button>
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            className="size-9 flex items-center justify-center duration-200 rounded-full text-[10px] md:text-xs font-medium transition-all hover:to-neutral-100 hover:from-neutral-200/80 text-gray-600 hover:text-neutral-800 dark:text-surface-400 dark:hover:text-surface-200 border hover:border-neutral-300 border-neutral-200/60 dark:border-surface-300/40 dark:hover:border-surface-300/60 shadow-xs backdrop-blur-md bg-linear-to-tr from-neutral-100 to-neutral-200/80 dark:from-surface-200 dark:to-surface-300/60 hover:ring-2 hover:ring-offset-1 hover:ring-neutral-200/80 dark:hover:ring-surface-400/40 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-200/80 focus:scale-95 transform-gpu will-change-transform"
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
