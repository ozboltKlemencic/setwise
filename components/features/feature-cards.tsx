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
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="group p-(--space-4) md:p-(--space-8) bg-surface-100  border border-surface-200 dark:bg-surface-100 shadow-(--shadow-sm)/80 ">
            <div className="flex items-center gap-(--space-2) mb-(--space-2) md:mb-(--space-3)">
                <div className="flex items-center justify-center size-7 md:size-9 rounded-lg md:rounded-xl bg-linear-to-tr from-brand-500/5 to-brand-500/15">
                    <Icon className="size-3.5 md:size-4.5 text-brand-500/80" />
                </div>
                <h4 className="text-subheadline md:text-headline font-semibold text-surface-900/80">
                    {title}
                </h4>
            </div>
            <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed">
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
}

export function KeyFeatureSection({ icon: Icon, title, children }: KeyFeatureSectionProps) {
    return (
        <div className="space-y-(--space-3) md:space-y-(--space-5)">
            <div className="flex items-center gap-(--space-2) md:gap-(--space-3)">
                <div className="flex items-center justify-center size-8 md:size-10 rounded-lg md:rounded-xl bg-linear-to-tr from-brand-500/5 to-brand-500/15">
                    <Icon className="size-4 md:size-5 text-brand-500/80" />
                </div>
                <h3 className="text-title-3 md:text-title-1 font-bold text-surface-900 tracking-tight">
                    {title}
                </h3>
            </div>
            <div className="pl-0 md:pl-13">
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
}

export function MiniFeatureCard({ title, description }: MiniFeatureCardProps) {
    return (
        <div className="p-(--space-3) md:p-(--space-6) bg-surface-50 dark:bg-surface-200/10  border border-surface-200 dark:border-surface-300/40 shadow-(--shadow-xs) transition-shadow duration-200 hover:shadow-(--shadow-sm)">
            <strong className="block text-subheadline md:text-headline font-semibold text-surface-900 mb-(--space-1)">
                {title}
            </strong>
            <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed">
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
    description: string
}

export function StepCard({ step, title, description }: StepCardProps) {
    return (
        <div className="space-y-(--space-2) md:space-y-(--space-3)">
            <div className="flex items-center justify-center size-8 md:size-10 rounded-lg md:rounded-xl bg-surface-200/60 dark:bg-surface-300/20 shrink-0">
                {step}
            </div>
            <h4 className="text-subheadline md:text-headline font-semibold text-surface-900">
                {title}
            </h4>
            <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed">
                {description}
            </p>
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
}

export function SecurityItem({ icon: Icon, title, description }: SecurityItemProps) {
    return (
        <div className="flex gap-(--space-2) md:gap-(--space-4) items-start">
            <div className="flex items-center justify-center size-8 md:size-10 rounded-lg md:rounded-xl bg-surface-200/60 dark:bg-surface-300/20 shrink-0">
                <Icon className="size-4 md:size-5 text-surface-500" />
            </div>
            <div className="space-y-(--space-0.5) md:space-y-(--space-1)">
                <h4 className="text-subheadline md:text-headline font-semibold text-surface-900">
                    {title}
                </h4>
                <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed">
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
}

export function BenefitBadge({ icon: Icon, label }: BenefitBadgeProps) {
    return (
        <div className="flex items-center gap-(--space-1.5) md:gap-(--space-2) text-footnote md:text-subheadline font-medium text-surface-800">
            <Icon className="size-3.5 md:size-4 text-success shrink-0" />
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
}

export function FeatureTextBlock({ lead, children }: FeatureTextBlockProps) {
    return (
        <p className="text-footnote md:text-body text-surface-700 leading-relaxed">
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
