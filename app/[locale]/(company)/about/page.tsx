import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Users, Mail, UserRoundCog } from "lucide-react"

const quickLinks = [
    { href: '/our-team', icon: Users, translationKey: 'team' },
    { href: '/contact', icon: Mail, translationKey: 'contact' },
    { href: '/support', icon: UserRoundCog, translationKey: 'support' },
] as const

export default async function AboutPage() {
    const t = await getTranslations('About')
    const sections = ['focus', 'developer', 'goal'] as const

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-8 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-3xl border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t('title')}
                    </h1>
                </header>

                {/* ── Content ───────────────────────────────── */}
                <div className="space-y-(--space-6) md:space-y-(--space-8) pb-(--space-10) md:pb-(--space-16)">
                    <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed whitespace-pre-line max-w-prose">
                        {t('intro')}
                    </p>

                    <div className="space-y-(--space-5) md:space-y-(--space-6)">
                        {sections.map((section, sectionIndex) => (
                            <div key={section}>
                                <div>
                                    <h2 className="text-subheadline md:text-title-3 font-bold text-surface-900 tracking-tight">
                                        {t(`sections.${section}.title`)}
                                    </h2>
                                    <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed mt-(--space-2)">
                                        {t(`sections.${section}.content`)}
                                    </p>
                                </div>
                                {sectionIndex < sections.length - 1 && (
                                    <div className="h-px w-full bg-surface-200 dark:bg-surface-300 mt-(--space-5) md:mt-(--space-6)" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Quick Links ────────────────────────── */}
                    <div className="h-px w-full bg-surface-200 dark:bg-surface-300" />

                    <div>
                        <h2 className="text-subheadline md:text-title-3 font-bold text-surface-900 tracking-tight">
                            {t('links.title')}
                        </h2>
                        <div className="flex flex-col gap-(--space-2\.5) mt-(--space-3)">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex items-center gap-(--space-1\.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                                >
                                    <link.icon className="size-3.5 shrink-0" />
                                    <span>{t(`links.${link.translationKey}`)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
