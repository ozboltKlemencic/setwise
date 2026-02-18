"use client"

import { useMemo } from "react"
import {
    Download,
    PlusCircle,
    Info
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Sidebar, MobileSidebar, type SidebarItem } from "@/components/sidebar"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import { ParticleText } from "@/components/ui/particle-text"

export function GuidesSidebar() {
    const t = useTranslations('Guides.Sidebar')

    const guidesSidebarItems: SidebarItem[] = useMemo(() => [
        {
            title: t('intro.title'),
            href: "/guides",
            icon: Info,
            subItems: [
                { title: t('intro.welcome'), href: "/guides#welcome" },
                { title: t('intro.howTo'), href: "/guides#how-to-get-the-most" },
            ]
        },
        {
            title: t('installation.title'),
            href: "/guides/installation",
            icon: Download,
            subItems: [
                { title: t('installation.overview'), href: "/guides/installation#overview" },
                { title: t('installation.ios'), href: "/guides/installation#ios" },
                { title: t('installation.android'), href: "/guides/installation#android" },
                { title: t('installation.requirements'), href: "/guides/installation#requirements" },
            ]
        },
        {
            title: t('createWorkout.title'),
            href: "/guides/create-workout",
            icon: PlusCircle,
            subItems: [
                { title: t('createWorkout.overview'), href: "/guides/create-workout#overview" },
                { title: t('createWorkout.methods'), href: "/guides/create-workout#methods" },
                { title: t('createWorkout.tips'), href: "/guides/create-workout#tips" },
            ]
        },
    ], [t])

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden min-[1152px]:block w-64 shrink-0 border-r border-border/40 relative">
                <div className="sticky top-18 h-[calc(100vh-(--spacing(20)))] overflow-y-auto no-scrollbar">
                    <Sidebar items={guidesSidebarItems}>
                        {/* Beta CTA Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-border/60 dark:border-border/40 bg-backgorund ">
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <ParticleText text=" " backgroundBrightness={{ dark: 190, light: 100 }} className="h-full w-full" />
                            </div>

                            <div className="relative z-10 p-5 flex flex-col items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-surface-700 tracking-tight">
                                        {t('betaTitle')}
                                    </h3>
                                    <p className="text-sm text-surface-600 dark:text-surface-600 leading-relaxed font-sans">
                                        {t('betaDescription')}
                                    </p>
                                </div>

                                <BetaSignupDialog
                                    trigger={
                                        <ButtonRotatingGradient className="w-full text-base font-semibold">
                                            {t('betaButton')}
                                        </ButtonRotatingGradient>
                                    }
                                />
                            </div>
                        </div>
                    </Sidebar>
                </div>
            </aside>

            {/* Mobile sidebar (floating button + bottom sheet) */}
            <MobileSidebar items={guidesSidebarItems} title={t('mobileTitle')} />
        </>
    )
}
