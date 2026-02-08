import { cn } from "@/lib/utils"

interface BlurProps {
    className?: string
    /** Inline styles for complex backgrounds like radial-gradient */
    style?: React.CSSProperties
    children?: React.ReactNode
}

/**
 * Decorative blur orb for subtle background glow effects.
 * Absolutely positioned, rounded, blurred, and non-interactive by default.
 *
 * @example
 * // Simple color glow
 * <Blur className="top-0 right-0 w-2/5 h-full bg-brand-500/5" />
 *
 * @example
 * // Radial gradient glow
 * <Blur
 *   className="inset-0 -z-1 blur-(--blur-ultra) opacity-(--opacity-muted)"
 *   style={{ background: 'radial-gradient(circle at center, var(--background) 0%, transparent 80%)' }}
 * />
 */
export default function Blur({ className, style, children }: BlurProps) {
    return (
        <div
            className={cn(
                "absolute rounded-full pointer-events-none blur-(--blur-medium)",
                className
            )}
            style={style}
        >
            {children}
        </div>
    )
}
