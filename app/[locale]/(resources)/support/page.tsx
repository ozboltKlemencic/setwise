
import { getTranslations } from "next-intl/server"
import { Search, Smartphone, Dumbbell, User, HelpCircle } from "lucide-react"
import Link from "next/link"

const supportCards = [
    { key: 'installation', icon: Smartphone, href: '/guides/installation' },
    { key: 'createWorkout', icon: Dumbbell, href: '/guides/create-workout' },
    { key: 'account', icon: User, href: '/' }, // Placeholder
    { key: 'general', icon: HelpCircle, href: '/' }, // Placeholder
] as const

export default async function SupportPage() {
    const t = await getTranslations('Support')

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-0 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl ">

                {/* ── Page Header & Search ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-10) md:pt-(--space-16) md:pb-(--space-20) flex flex-col items-center text-center space-y-(--space-8)">

                    <h1 className="text-display-sm md:text-display font-bold text-surface-900 tracking-tight text-balance">
                        {t('title')}
                    </h1>

                    <div className="w-full max-w-xl space-y-(--space-3)">

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="size-5 text-surface-400 group-focus-within:text-brand-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                id="support-search"
                                placeholder={t('search.placeholder')}
                                className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-body placeholder:text-surface-400"
                            />
                        </div>
                    </div>
                </header>

                {/* ── Cards Grid ───────────────────────────────── */}
                <div className="pb-(--space-16) md:pb-(--space-24)">
                    {/* Decorative background behind cards */}
                    <div className="relative">
                        <div className="absolute inset-0 -mx-(--space-5) border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/60 outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 20}px`,
                                        left: "-50%",
                                        width: "200%",
                                    }}
                                />
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-(--space-4) py-(--space-8) relative z-10">
                            {supportCards.map(({ key, icon: Icon, href }) => (
                                <Link
                                    key={key}
                                    href={href}
                                    className="group p-(--space-6) bg-surface-100/50 backdrop-blur-xs border border-surface-200 rounded-2xl shadow-(--shadow-xs) hover:shadow-(--shadow-md) hover:border-brand-200 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center text-center space-y-(--space-4)">
                                        <div className="flex items-center justify-center size-12 rounded-xl bg-linear-to-tr from-brand-500/10 to-brand-500/20 group-hover:from-brand-500/20 group-hover:to-brand-500/30 transition-colors">
                                            <Icon className="size-6 text-brand-600" />
                                        </div>
                                        <div className="space-y-(--space-2)">
                                            <h3 className="text-title-3 font-bold text-surface-900 group-hover:text-brand-700 transition-colors">
                                                {t(`cards.${key}.title`)}
                                            </h3>
                                            <p className="text-body text-surface-600 leading-relaxed max-w-xs mx-auto">
                                                {t(`cards.${key}.description`)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
