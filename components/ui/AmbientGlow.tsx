import { cn } from "@/lib/utils"

interface AmbientGlowProps {
    className?: string
    /** Color of the glow. Defaults to "var(--brand-500)" */
    color?: string
    /** Opacity of the glow (0-100 for Tailwind scale). Defaults handled via className */
    children?: React.ReactNode
}

/**
 * Decorative ambient glow orb used as a subtle background effect.
 * Absolutely positioned, rounded, blurred, and non-interactive by default.
 *
 * @example
 * // Single glow
 * <AmbientGlow className="top-0 right-0 w-2/5 h-full translate-y-1/3 translate-x-1/2" />
 *
 * @example
 * // Custom color
 * <AmbientGlow className="top-0 left-0 w-1/2 h-full" color="var(--brand-300)" />
 */
export default function AmbientGlow({ className, color, children }: AmbientGlowProps) {
    return (
        <div
            className={cn(
                "absolute rounded-full pointer-events-none blur-(--blur-medium)",
                className
            )}
            {...(color ? { style: { backgroundColor: color } } : {})}
        >
            {children}
        </div>
    )
}
