import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Mail, Linkedin, Info, LifeBuoy, UserRoundCog } from "lucide-react"

export { generateMetadata } from './metadata'

/* ── Static team member data (non-translatable) ──────────── */
const teamMembers = [
    {
        key: 'jernej' as const,
        email: 'info@setwise.app',
        linkedin: 'https://www.linkedin.com/in/jernej-peternel-98ba0b371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
        avatar: '/team/jernej-peternel.png',
        initials: 'JP',
    },
    {
        key: 'ozbolt' as const,
        email: 'info@setwise.app',
        linkedin: 'https://www.linkedin.com/in/ozbolt-klemencic',
        avatar: '/team/ozbolt-klemencic.png',
        initials: 'OK',
    },
]

export default async function OurTeamPage() {
    const t = await getTranslations('OurTeam')

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

                    {/* ── Team Cards (stacked) ────────────────── */}
                    <div className="">
                        {teamMembers.map((member, memberIndex) => (
                            <div key={member.key}>
                                <div
                                    className="   transition-shadow duration-(--duration-normal) ease-(--ease-apple)"
                                >
                                    {/* Row 1 — Avatar + Name & Role */}
                                    <div className="flex items-center gap-(--space-3) md:gap-(--space-4)">
                                        <div className="relative size-12 md:size-14 rounded-full overflow-hidden bg-brand-50 dark:bg-brand-100 border border-surface-200 dark:border-surface-300 shrink-0">
                                            <Image
                                                src={member.avatar}
                                                alt={t(`sections.${member.key}.title`)}
                                                fill
                                                className="object-cover"
                                                sizes="56px"
                                            />
                                            {/* Initials fallback */}
                                            <div className="absolute inset-0 flex items-center justify-center text-subheadline font-bold text-brand-500 dark:text-brand-400 -z-10">
                                                {member.initials}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-subheadline md:text-title-3 font-bold text-surface-900 tracking-tight">
                                                {t(`sections.${member.key}.title`)}
                                            </h2>
                                            <p className="text-caption-1 md:text-footnote font-medium primaryGradient">
                                                {t(`sections.${member.key}.role`)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Row 2 — Description */}
                                    <p className="text-footnote md:text-subheadline text-surface-600 leading-relaxed mt-(--space-3)">
                                        {t(`sections.${member.key}.content`)}
                                    </p>

                                    {/* Row 3 — Email */}
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="inline-flex items-center gap-(--space-1) text-footnote text-surface-600 hover:text-surface-800 dark:hover:text-surface-800 transition-colors duration-(--duration-fast) ease-(--ease-apple) mt-(--space-2)"
                                    >
                                        <Mail className="size-3.5 shrink-0" />
                                        <span>{member.email}</span>
                                    </a>

                                    {/* Row 4 — LinkedIn */}
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-(--space-1) text-footnote text-surface-600 hover:text-surface-800 dark:hover:text-surface-800 transition-colors duration-(--duration-fast) ease-(--ease-apple) mt-(--space-1)"
                                    >
                                        <Linkedin className="size-3.5 shrink-0" />
                                        <span>LinkedIn</span>
                                    </a>
                                </div>
                                {memberIndex < teamMembers.length - 1 && (
                                    <div className="h-px w-full bg-surface-200 dark:bg-surface-300 my-(--space-5) md:my-(--space-6)" />
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
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-(--space-1\.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                            >
                                <Info className="size-3.5 shrink-0" />
                                <span>{t('links.about')}</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-(--space-1\.5) text-footnote font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                            >
                                <Mail className="size-3.5 shrink-0" />
                                <span>{t('links.contact')}</span>
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
