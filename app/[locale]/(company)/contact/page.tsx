import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Mail, Linkedin, Info, Users, LifeBuoy, UserRoundCog } from "lucide-react"

export { generateMetadata } from './metadata'

/* ── Static contact data ─────────────────────────────────── */
const generalEmail = 'info@setwise.app'

const teamContacts = [
    {
        name: 'Jernej Peternel',
        email: 'info@setwise.app',
        linkedin: 'https://www.linkedin.com/in/jernej-peternel-98ba0b371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    },
    {
        name: 'Ožbolt Klemenčič',
        email: 'info@setwise.app',
        linkedin: 'https://www.linkedin.com/in/ozbolt-klemencic',
    },
]

export default async function ContactPage() {
    const t = await getTranslations('Contact')

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

                        {/* ── General Inquiries ──────────────── */}
                        <div>
                            <h2 className="text-subheadline md:text-title-3 font-bold text-surface-900 tracking-tight">
                                {t('sections.general.title')}
                            </h2>
                            <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed mt-(--space-2)">
                                {t('sections.general.content')}
                            </p>
                            <a
                                href={`mailto:${generalEmail}`}
                                className="inline-flex items-center gap-(--space-1\.5) text-footnote text-surface-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-(--duration-fast) ease-(--ease-apple) mt-(--space-2\.5)"
                            >
                                <Mail className="size-3.5 shrink-0" />
                                <span>{generalEmail}</span>
                            </a>
                        </div>

                        <div className="h-px w-full bg-surface-200 dark:bg-surface-300" />

                        {/* ── Reach the Team ─────────────────── */}
                        <div>
                            <h2 className="text-subheadline md:text-title-3 font-bold text-surface-900 tracking-tight">
                                {t('sections.team.title')}
                            </h2>
                            <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed mt-(--space-2)">
                                {t('sections.team.content')}
                            </p>

                            <div className="space-y-(--space-4) mt-(--space-3)">
                                {teamContacts.map((person) => (
                                    <div key={person.email}>
                                        <p className="text-footnote md:text-subheadline font-semibold text-surface-900">
                                            {person.name}
                                        </p>
                                        <div className="flex flex-wrap flex-col gap-y-1 items-start gap-(--space-3) mt-(--space-1)">
                                            <a
                                                href={`mailto:${person.email}`}
                                                className="inline-flex items-center gap-(--space-1\.5) text-footnote text-surface-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                                            >
                                                <Mail className="size-3.5 shrink-0" />
                                                <span>{person.email}</span>
                                            </a>
                                            <a
                                                href={person.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-(--space-1\.5) text-footnote text-surface-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                                            >
                                                <Linkedin className="size-3.5 shrink-0" />
                                                <span>LinkedIn</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ── Quick Links ────────────────────────── */}
                    <div className="h-px w-full bg-surface-200 dark:bg-surface-300" />

                    <div>
                        <h2 className="text-subheadline md:text-title-3 font-bold text-surface-900 tracking-tight">
                            {t('links.title')}
                        </h2>
                        <div className="flex flex-col gap-(--space-2\.5) mt-(--space-3)">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-(--space-1\.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                            >
                                <Info className="size-3.5 shrink-0" />
                                <span>{t('links.about')}</span>
                            </Link>
                            <Link
                                href="/our-team"
                                className="inline-flex items-center gap-(--space-1\.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                            >
                                <Users className="size-3.5 shrink-0" />
                                <span>{t('links.team')}</span>
                            </Link>
                            <Link
                                href="/support"
                                className="inline-flex items-center gap-(--space-1\.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                            >
                                <UserRoundCog className="size-3.5 shrink-0" />
                                <span>{t('links.support')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
