import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

/* ============================================================
   FEATURE PAGE — Reusable Components
   ─────────────────────────────────────────────────────────────
   Apple HIG inspired card components for the features page.
   All components follow the design system tokens from globals.css.
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// 1. FeatureCard — Overview section highlight cards
//    Usage: 2×2 grid in the overview section
// ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
    compact?: boolean
}

export function FeatureCard({ icon: Icon, title, description, compact = false }: FeatureCardProps) {
    return (
        <div className={`group bg-surface-100 border  border-surface-200 dark:bg-surface-100 shadow-(--shadow-sm)/80 ${compact ? "p-(--space-4) md:p-(--space-6)" : "p-(--space-4) md:p-(--space-8)"}`}>
            <div className={`flex items-center gap-(--space-2) ${compact ? "mb-(--space-2)" : "mb-(--space-2) md:mb-(--space-3)"}`}>
                <div className={`flex items-center justify-center rounded-lg  bg-linear-to-tr from-brand-500/5 to-brand-500/15 ${compact ? "size-7 md:size-8" : "size-7 md:size-9"}`}>
                    <Icon className={`text-brand-500/80 ${compact ? "size-3.5 md:size-4" : "size-3.5 md:size-4.5"}`} />
                </div>
                <h4 className={`font-semibold text-surface-900/80 ${compact ? "text-subheadline md:text-callout" : "text-subheadline md:text-headline"}`}>
                    {title}
                </h4>
            </div>
            <p className={`text-surface-600 leading-relaxed ${compact ? "text-footnote md:text-footnote" : "text-footnote md:text-subheadline"}`}>
                {description}
            </p>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 2. KeyFeatureSection — Detailed feature section with icon header
//    Usage: Each major feature in the key-features section
// ─────────────────────────────────────────────────────────────

interface KeyFeatureSectionProps {
    icon: LucideIcon
    title: string
    children: ReactNode
    compact?: boolean
}

export function KeyFeatureSection({ icon: Icon, title, children, compact = false }: KeyFeatureSectionProps) {
    return (
        <div className={compact ? "space-y-(--space-2) md:space-y-(--space-4)" : "space-y-(--space-3) md:space-y-(--space-5)"}>
            <div className={compact ? "flex items-center gap-(--space-2) md:gap-(--space-2)" : "flex items-center gap-(--space-2) md:gap-(--space-3)"}>
                <div className={`flex items-center justify-center rounded-lg bg-linear-to-tr from-brand-500/5 to-brand-500/15 ${compact ? "size-7 md:size-8" : "size-8 md:size-10"}`}>
                    <Icon className={compact ? "size-3.5 md:size-4 text-brand-500/80" : "size-4 md:size-5 text-brand-500/80"} />
                </div>
                <h3 className={compact ? "text-title-3 md:text-title-2 font-bold text-surface-900 tracking-tight" : "text-title-3 md:text-title-1 font-bold text-surface-900 tracking-tight"}>
                    {title}
                </h3>
            </div>
            <div className={compact ? "pl-0 md:pl-10" : "pl-0 md:pl-13"}>
                {children}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 3. MiniFeatureCard — Compact card for advanced features grid
//    Usage: 2×2 grid within advanced features
// ─────────────────────────────────────────────────────────────

interface MiniFeatureCardProps {
    title: string
    description: string
    compact?: boolean
}

export function MiniFeatureCard({ title, description, compact = false }: MiniFeatureCardProps) {
    return (
        <div className={`bg-surface-50 dark:bg-surface-200/10 border border-surface-200 dark:border-surface-300/40 shadow-(--shadow-xs) transition-shadow duration-200 hover:shadow-(--shadow-sm) ${compact ? "p-(--space-3) md:p-(--space-5)" : "p-(--space-3) md:p-(--space-6)"}`}>
            <strong className={`block font-semibold text-surface-900 mb-(--space-1) ${compact ? "text-subheadline md:text-callout" : "text-subheadline md:text-headline"}`}>
                {title}
            </strong>
            <p className={`text-surface-600 leading-relaxed ${compact ? "text-footnote md:text-footnote" : "text-footnote md:text-subheadline"}`}>
                {description}
            </p>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 4. StepCard — Numbered step card for get-started section
//    Usage: 3-column grid showing onboarding steps
// ─────────────────────────────────────────────────────────────

interface StepCardProps {
    step: number
    title: string
    description: ReactNode
    compact?: boolean
}

export function StepCard({ step, title, description, compact = false }: StepCardProps) {
    return (
        <div className={compact ? "space-y-(--space-1) md:space-y-(--space-2)" : "space-y-(--space-2) md:space-y-(--space-3)"}>
            <div className={`flex items-center justify-center rounded-lg  bg-linear-to-tr from-surface-200/70 to-surface-300 dark:bg-surface-300/20 shrink-0 ${compact ? "size-7 md:size-8" : "size-8 md:size-10"}`}>
                {step}
            </div>
            <h4 className={compact ? "text-subheadline md:text-callout font-semibold text-surface-900" : "text-subheadline md:text-headline font-semibold text-surface-900"}>
                {title}
            </h4>
            <div className={compact ? "text-footnote md:text-footnote text-surface-600 leading-relaxed" : "text-footnote md:text-subheadline text-surface-600 leading-relaxed"}>
                {description}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 5. SecurityItem — Icon + text row for security section
//    Usage: 2-column grid in the security section
// ─────────────────────────────────────────────────────────────

interface SecurityItemProps {
    icon: LucideIcon
    title: string
    description: string
    compact?: boolean
}

export function SecurityItem({ icon: Icon, title, description, compact = false }: SecurityItemProps) {
    return (
        <div className={compact ? "flex gap-(--space-2) md:gap-(--space-3) items-start" : "flex gap-(--space-2) md:gap-(--space-4) items-start"}>
            <div className={`flex items-center justify-center rounded-lg  bg-linear-to-tr from-surface-200/70 to-surface-300/70 dark:bg-surface-300/20 shrink-0 ${compact ? "size-7 md:size-8" : "size-8 md:size-10"}`}>
                <Icon className={compact ? "size-3.5 md:size-4 text-surface-500" : "size-4 md:size-5 text-surface-500"} />
            </div>
            <div className={compact ? "space-y-(--space-1)" : "space-y-(--space-1) md:space-y-(--space-1)"}>
                <h4 className={compact ? "text-subheadline md:text-callout font-semibold text-surface-900" : "text-subheadline md:text-headline font-semibold text-surface-900"}>
                    {title}
                </h4>
                <p className={compact ? "text-footnote md:text-footnote text-surface-600 leading-relaxed" : "text-footnote md:text-subheadline text-surface-600 leading-relaxed"}>
                    {description}
                </p>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 6. BenefitBadge — Check icon + label for benefit lists
//    Usage: Horizontal list of benefits in CTA section
// ─────────────────────────────────────────────────────────────

interface BenefitBadgeProps {
    icon: LucideIcon
    label: string
    compact?: boolean
}

export function BenefitBadge({ icon: Icon, label, compact = false }: BenefitBadgeProps) {
    return (
        <div className={compact ? "flex items-center gap-(--space-1) md:gap-(--space-2) text-footnote md:text-footnote font-medium text-surface-800" : "flex items-center gap-(--space-2) md:gap-(--space-2) text-footnote md:text-subheadline font-medium text-surface-800"}>

            <Icon className={compact ? "size-3 md:size-3.5 text-success shrink-0" : "size-3.5 md:size-4 text-success shrink-0"} />

            <span>{label}</span>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 7. FeatureTextBlock — Paragraph with bold lead for feature descriptions
//    Usage: Inside KeyFeatureSection children
// ─────────────────────────────────────────────────────────────

interface FeatureTextBlockProps {
    lead: string
    children: ReactNode
    compact?: boolean
}

export function FeatureTextBlock({ lead, children, compact = false }: FeatureTextBlockProps) {
    return (
        <p className={compact ? "text-footnote md:text-subheadline text-surface-700 leading-relaxed" : "text-footnote md:text-body text-surface-700 leading-relaxed"}>
            <strong className="text-surface-900 font-semibold">{lead}</strong>{" "}
            {children}
        </p>
    )
}

// ─────────────────────────────────────────────────────────────
// 8. SectionDivider — Consistent horizontal rule between sections
// ─────────────────────────────────────────────────────────────

export function SectionDivider() {
    return (
        <hr className="border-surface-200/80 dark:border-surface-300/60 -mx-(--space-3) md:-mx-(--space-12)" />
    )
}
