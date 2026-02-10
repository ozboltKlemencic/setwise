export default function FeaturesLoading() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans">
            <div className="w-full px-(--space-6) md:px-(--space-12) max-w-5xl animate-pulse">

                {/* Header skeleton */}
                <div className="pt-(--space-12) pb-(--space-8) md:pt-(--space-16) md:pb-(--space-10) space-y-(--space-3)">
                    <div className="h-3 w-20 rounded-md bg-surface-200 dark:bg-surface-300/20" />
                    <div className="h-10 md:h-12 w-80 max-w-full rounded-xl bg-surface-200 dark:bg-surface-300/15" />
                </div>

                <div className="space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-16)">

                    {/* Overview section skeleton */}
                    <div className="space-y-(--space-8)">
                        <div className="space-y-(--space-3)">
                            <div className="h-7 w-32 rounded-lg bg-surface-200 dark:bg-surface-300/15" />
                            <div className="h-5 w-56 rounded-lg bg-surface-200/70 dark:bg-surface-300/10" />
                            <div className="space-y-(--space-2) pt-(--space-1)">
                                <div className="h-4 w-full max-w-xl rounded bg-surface-100 dark:bg-surface-300/8" />
                                <div className="h-4 w-full max-w-lg rounded bg-surface-100 dark:bg-surface-300/8" />
                                <div className="h-4 w-3/4 max-w-md rounded bg-surface-100 dark:bg-surface-300/8" />
                            </div>
                        </div>

                        {/* Cards grid skeleton */}
                        <div className="grid md:grid-cols-2 gap-(--space-4) md:gap-(--space-6)">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="p-(--space-6) rounded-2xl bg-surface-100 dark:bg-surface-200/10 border border-surface-200/60 dark:border-surface-300/20"
                                >
                                    <div className="flex items-center gap-(--space-2) mb-(--space-3)">
                                        <div className="size-9 rounded-xl bg-surface-200/80 dark:bg-surface-300/15" />
                                        <div className="h-4 w-28 rounded bg-surface-200 dark:bg-surface-300/15" />
                                    </div>
                                    <div className="space-y-(--space-2)">
                                        <div className="h-3.5 w-full rounded bg-surface-200/60 dark:bg-surface-300/10" />
                                        <div className="h-3.5 w-4/5 rounded bg-surface-200/60 dark:bg-surface-300/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-surface-200/50 dark:border-surface-300/30" />

                    {/* Key Features section skeleton */}
                    <div className="space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <div className="h-3 w-24 rounded-md bg-surface-200 dark:bg-surface-300/20" />
                            <div className="h-8 w-40 rounded-lg bg-surface-200 dark:bg-surface-300/15" />
                        </div>

                        {/* Feature blocks */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-(--space-5)">
                                <div className="flex items-center gap-(--space-3)">
                                    <div className="size-10 rounded-xl bg-surface-200/80 dark:bg-surface-300/15" />
                                    <div className="h-6 w-48 rounded-lg bg-surface-200 dark:bg-surface-300/15" />
                                </div>
                                <div className="pl-0 md:pl-13 space-y-(--space-3)">
                                    <div className="h-4 w-full max-w-lg rounded bg-surface-100 dark:bg-surface-300/8" />
                                    <div className="h-4 w-full max-w-md rounded bg-surface-100 dark:bg-surface-300/8" />
                                    <div className="h-4 w-3/5 rounded bg-surface-100 dark:bg-surface-300/8" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <hr className="border-surface-200/50 dark:border-surface-300/30" />

                    {/* Get Started section skeleton */}
                    <div className="space-y-(--space-12)">
                        <div className="space-y-(--space-2)">
                            <div className="h-3 w-16 rounded-md bg-surface-200 dark:bg-surface-300/20" />
                            <div className="h-8 w-36 rounded-lg bg-surface-200 dark:bg-surface-300/15" />
                        </div>

                        {/* CTA card skeleton */}
                        <div className="rounded-2xl p-(--space-6) md:p-(--space-8) bg-surface-100 dark:bg-surface-200/10 border border-surface-200/40 dark:border-surface-300/15">
                            <div className="h-6 w-72 max-w-full rounded-lg bg-surface-200/80 dark:bg-surface-300/15 mb-(--space-2)" />
                            <div className="h-4 w-full max-w-md rounded bg-surface-200/60 dark:bg-surface-300/10 mb-(--space-8)" />
                            <div className="grid gap-(--space-4) sm:grid-cols-2 lg:grid-cols-4 mb-(--space-8)">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-(--space-2)">
                                        <div className="size-4 rounded-full bg-surface-200 dark:bg-surface-300/15" />
                                        <div className="h-3.5 w-24 rounded bg-surface-200/70 dark:bg-surface-300/10" />
                                    </div>
                                ))}
                            </div>
                            <div className="h-12 w-56 rounded-full bg-surface-200 dark:bg-surface-300/15" />
                        </div>

                        {/* Steps skeleton */}
                        <div className="grid md:grid-cols-3 gap-(--space-8) md:gap-(--space-10)">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-(--space-3)">
                                    <div className="size-10 rounded-full bg-surface-200 dark:bg-surface-300/15" />
                                    <div className="h-4 w-28 rounded bg-surface-200 dark:bg-surface-300/15" />
                                    <div className="space-y-(--space-1.5)">
                                        <div className="h-3.5 w-full rounded bg-surface-100 dark:bg-surface-300/8" />
                                        <div className="h-3.5 w-4/5 rounded bg-surface-100 dark:bg-surface-300/8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
