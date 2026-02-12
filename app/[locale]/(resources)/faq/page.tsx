"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

const filterOrder = ["all", "installation", "guides", "features", "account"] as const
type FilterKey = (typeof filterOrder)[number]
type FAQCategory = Exclude<FilterKey, "all">

type FAQItem = {
    category: FAQCategory
    question: string
    answer: string
}

export default function FAQPage() {
    const t = useTranslations("FAQPage")
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

    const faqItems = t.raw("items") as Record<string, FAQItem>
    const entries = Object.entries(faqItems)

    const countsByFilter = useMemo(() => {
        const counts: Record<FilterKey, number> = {
            all: entries.length,
            installation: 0,
            guides: 0,
            features: 0,
            account: 0,
        }

        for (const [, item] of entries) {
            counts[item.category] += 1
        }

        return counts
    }, [entries])

    const filteredEntries = useMemo(() => {
        if (activeFilter === "all") {
            return entries
        }

        return entries.filter(([, item]) => item.category === activeFilter)
    }, [activeFilter, entries])

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl ">
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-8) text-center flex flex-col items-center justify-center">
                    <p className="text-caption-2  tracking-wider font-semibold primaryGradient mb-1">
                        {t("badge")}
                    </p>
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-center text-surface-900 tracking-tight text-balance md:max-w-[400px] ">
                        {t.rich("heading", {
                            primary: (chunks) => <span className="primaryGradient">{chunks}</span>,
                        })}
                    </h1>
                    <p className="mt-(--space-2) md:max-w-sm md:px-(--space-6) text-center md:mt-(--space-3) text-subheadline md:text-callout text-surface-600 max-w-2xl mx-auto leading-relaxed">
                        {t("description")}
                    </p>
                </header>

                <section className="pb-(--space-10) md:pb-(--space-16)">
                    <div className="flex flex-wrap justify-center gap-(--space-2) md:gap-(--space-3)">
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

                    <p className="text-center mt-(--space-6) my-(--space-4) text-footnote text-surface-500">
                        {t("resultsLabel", { count: filteredEntries.length })}
                    </p>

                    <div className="mt-(--space-5) md:mt-(--space-7) space-y-(--space-3) md:space-y-(--space-4) md:mx-(--space-8) lg:-mx-(--space-10)">
                        {filteredEntries.map(([key, item]) => (
                            <article
                                key={key}
                                className="rounded-sm border border-border bg-card/70 px-(--space-4) md:px-(--space-6) py-(--space-4) md:py-(--space-5)"
                            >
                                <h2 className="text-subheadline md:text-headline font-semibold text-surface-900 tracking-tight">
                                    {item.question}
                                </h2>
                                <p className="mt-(--space-2) text-footnote md:text-subheadline text-surface-600 leading-relaxed">
                                    {item.answer}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
