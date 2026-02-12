 "use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const filterOrder = ["all", "improvements", "updates", "releases"] as const
type FilterKey = (typeof filterOrder)[number]
type UpdateTone = "release" | "improvement" | "update"

export default function ChangelogPage() {
    const t = useTranslations("Changelog")
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
    const [openIndex, setOpenIndex] = useState(0)
    const toneStyles: Record<string, string> = {
        release: "text-brand-700 dark:text-brand-300 border-brand-300/80 dark:border-brand-400/40 bg-brand-500/8 dark:bg-brand-500/15",
        improvement: "text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-400/40 bg-amber-500/8 dark:bg-amber-500/15",
        update: "text-sky-700 dark:text-sky-300 border-sky-300/80 dark:border-sky-400/40 bg-sky-500/8 dark:bg-sky-500/15",
    }
    const yearGroups = [
        {
            key: "2026",
            updates: [{ key: "v1_0_1", tone: "update" as UpdateTone }],
        },
        {
            key: "2025",
            updates: [{ key: "first_release", tone: "release" as UpdateTone }],
        },
    ] as const

    const allUpdatesCount = yearGroups.reduce((sum, year) => sum + year.updates.length, 0)

    const countsByFilter = useMemo(() => {
        const counts: Record<FilterKey, number> = {
            all: allUpdatesCount,
            improvements: 0,
            updates: 0,
            releases: 0,
        }

        for (const year of yearGroups) {
            for (const update of year.updates) {
                if (update.tone === "improvement") counts.improvements += 1
                if (update.tone === "update") counts.updates += 1
                if (update.tone === "release") counts.releases += 1
            }
        }

        return counts
    }, [allUpdatesCount, yearGroups])

    const filteredYearGroups = useMemo(() => {
        if (activeFilter === "all") {
            return yearGroups
        }

        const toneFilter: UpdateTone =
            activeFilter === "improvements"
                ? "improvement"
                : activeFilter === "updates"
                    ? "update"
                    : "release"

        return yearGroups
            .map((year) => ({
                ...year,
                updates: year.updates.filter((update) => update.tone === toneFilter),
            }))
            .filter((year) => year.updates.length > 0)
    }, [activeFilter, yearGroups])

    useEffect(() => {
        if (filteredYearGroups.length === 0) {
            setOpenIndex(-1)
            return
        }

        if (openIndex >= filteredYearGroups.length) {
            setOpenIndex(0)
        }
    }, [filteredYearGroups.length, openIndex])

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-8 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-6xl ">
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-6) min-[1152px]:pr-(--space-8)">
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t("title")}
                    </h1>
                    <p className="text-footnote md:text-subheadline text-surface-500 font-medium mt-(--space-2)">
                        {t("lastUpdated")}
                    </p>
                </header>

                <div className="space-y-(--space-6) md:space-y-(--space-8) pb-(--space-10) md:pb-(--space-8)">
                  

                    <div className="flex flex-wrap gap-(--space-2) md:gap-(--space-3)">
                        {filterOrder.map((filterKey) => {
                            const isActive = activeFilter === filterKey

                            return (
                                <button
                                    key={filterKey}
                                    type="button"
                                    onClick={() => setActiveFilter(filterKey)}
                                    className={`flex cursor-pointer items-center justify-center gap-(--space-1) px-(--space-3) md:px-(--space-4) py-(--space-2) rounded-lg border transition-colors duration-(--duration-normal) ${isActive
                                        ? "bg-linear-to-tr from-brand-500 to-brand-300 text-white border-brand-300 shadow-(--shadow-sm)"
                                        : "bg-linear-to-tr from-surface-300 to-surface-200 text-surface-700 border-border hover:bg-surface-100 dark:hover:bg-surface-300/20"
                                        }`}
                                >
                                    <span className="text-footnote md:text-subheadline font-medium">
                                        {t(`filters.${filterKey}`)}
                                    </span>
                                    <span className={`text-footnote  ${isActive
                                        ? "bg-pred-600/20 text-white"
                                        : "bg-rped-200/80 text-surface-600  dark:text-surface-600"
                                        }`}>
                                        ({countsByFilter[filterKey]})
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div>
                        {filteredYearGroups.map((group, index) => (
                            <div key={group.key} className="border-b border-border/60">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                                    className="w-full cursor-pointer select-none py-(--space-4) md:py-(--space-5) text-title-2 md:text-title-1 font-bold text-surface-800 tracking-tight flex items-center justify-between"
                                    aria-expanded={openIndex === index}
                                >
                                    <span>{t(`years.${group.key}.title`)}</span>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <ChevronDown className="size-5 text-surface-500" />
                                    </motion.div>
                                </button>

                               

                                <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                height: { duration: 0.34, ease: [0.4, 0, 0.2, 1] },
                                                opacity: { duration: 0.22, ease: "easeInOut" },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-(--space-5) md:pb-(--space-6) space-y-(--space-3)">
                                                {group.updates.map((update) => (
                                                    <article
                                                        key={update.key}
                                                        className="bg-surface-100/40 dark:bg-surface-100/5 px-(--space-4) md:px-(--space-5) py-(--space-4) md:py-(--space-5)"
                                                    >
                                                        <div className="flex items-center justify-between gap-(--space-3)">
                                                            <div className="flex items-center gap-(--space-2)">
                                                                <span className="text-caption-1 uppercase tracking-wide text-surface-500">
                                                                    {t(`years.${group.key}.updates.${update.key}.date`)}
                                                                </span>
                                                                <span
                                                                    className={`text-caption-1 uppercase tracking-wide px-(--space-2) py-0.5 rounded-md border ${toneStyles[update.tone] ?? toneStyles.update}`}
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
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                        {filteredYearGroups.length === 0 && (
                            <p className="py-(--space-5) text-footnote md:text-subheadline text-surface-500">
                                {t("noResults")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
