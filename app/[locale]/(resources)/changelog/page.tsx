import { getTranslations } from "next-intl/server" 
import { ChevronDown } from "lucide-react"

export default async function ChangelogPage() {
    const t = await getTranslations("Changelog")
    const yearGroups = [
        {
            key: "2026",
            updates: [{ key: "v1_0_1", tone: "update" }] as const,
        },
        {
            key: "2025",
            updates: [{ key: "first_release", tone: "release" }] as const,
        },
    ] as const

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-8 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-6xl border-surface-200">
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t("title")}
                    </h1>
                    <p className="text-footnote md:text-subheadline text-surface-500 font-medium mt-(--space-2)">
                        {t("lastUpdated")}
                    </p>
                </header>

                <div className="space-y-(--space-6) md:space-y-(--space-8) pb-(--space-10) md:pb-(--space-16)">
                    <p className="text-footnote md:text-subheadline lg:text-callout text-surface-700 leading-relaxed max-w-prose">
                        {t("intro")}
                    </p>

                    <div className="border-t border-border/60">
                        {yearGroups.map((group, index) => (
                            <details
                                key={group.key}
                                open={index === 0}
                                className="group border-b border-border/60"
                            >
                                <summary className="list-none cursor-pointer select-none py-(--space-4) md:py-(--space-5) text-title-2 md:text-title-1 font-bold text-surface-800 tracking-tight flex items-center justify-between">
                                    <span>{t(`years.${group.key}.title`)}</span>
                                    <ChevronDown className="size-5 text-surface-500 transition-transform duration-(--duration-fast) ease-(--ease-apple) group-open:rotate-180" />
                                </summary>

                                <div className="pb-(--space-5) md:pb-(--space-6) space-y-(--space-3)">
                                    {group.updates.map((update) => (
                                        <article
                                            key={update.key}
                                            className="border border-border/60 bg-surface-100/40 dark:bg-surface-100/5 px-(--space-4) md:px-(--space-5) py-(--space-4) md:py-(--space-5)"
                                        >
                                            <div className="flex items-center justify-between gap-(--space-3)">
                                                <div className="flex items-center gap-(--space-2)">
                                                    <span className="text-caption-1 uppercase tracking-wide text-surface-500">
                                                        {t(`years.${group.key}.updates.${update.key}.date`)}
                                                    </span>
                                                    <span
                                                        className={`text-caption-1 uppercase tracking-wide px-(--space-2) py-0.5 rounded-md border ${update.tone === "release"
                                                            ? "text-brand-700 dark:text-brand-300 border-brand-300/80 dark:border-brand-400/40 bg-brand-500/8 dark:bg-brand-500/15"
                                                            : update.tone === "improvement"
                                                                ? "text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-400/40 bg-amber-500/8 dark:bg-amber-500/15"
                                                                : "text-sky-700 dark:text-sky-300 border-sky-300/80 dark:border-sky-400/40 bg-sky-500/8 dark:bg-sky-500/15"
                                                            }`}
                                                    >
                                                        {t(`years.${group.key}.updates.${update.key}.badge`)}
                                                    </span>
                                                </div>
                                                <span className="hidden md:block text-caption-1 uppercase tracking-wider text-surface-500">
                                                    {t(`years.${group.key}.updates.${update.key}.area`)}
                                                </span>
                                            </div>

                                            <h3 className="mt-(--space-3) text-subheadline md:text-title-3 font-semibold text-surface-900 tracking-tight">
                                                {t(`years.${group.key}.updates.${update.key}.title`)}
                                            </h3>
                                            <p className="mt-(--space-2) text-footnote md:text-subheadline text-surface-600 leading-relaxed whitespace-pre-line">
                                                {t(`years.${group.key}.updates.${update.key}.content`)}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
