import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import FooterSection from "@/components/footer-section"
import { FeaturesSidebar } from "./features-sidebar"
import { getTranslations } from "next-intl/server"

import { ParticleText } from "@/components/ui/particle-text"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata' })

    return {
        title: `Features - SetWise`,
    }
}

import { HashScrollHandler } from "@/components/features/hash-scroll-handler"

export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="w-full min-h-screen relative bg-background flex flex-col items-center">
            <HashScrollHandler />
            <div className="w-full flex justify-center flex-1">
                <main className="w-[94vw] md:w-6xl relative flex flex-col border-l border-r 
                border-border/50 dark:border-border/40 bg-background">

                    <div className="md:sticky md:top-0 md:z-(--z-fixed) md:bg-background md:border-b md:border-border/50 md:dark:border-border/40">
                        <Navigation />
                    </div>

                    <div className="flex flex-1 border-t border-border/50 dark:border-border/40 md:border-t-0 relative">
                        {/* Sidebar - Sticky */}
                        <aside className="hidden md:block w-64 shrink-0 border-r border-border/40 relative">
                            <div className="sticky top-[4.5rem] h-[calc(100vh_-_theme(spacing.20))] overflow-y-auto no-scrollbar">
                                <FeaturesSidebar />
                            </div>
                        </aside>

                        {/* Content Area */}
                        <div id="features-content" className="flex-1 flex flex-col min-w-0">
                            <div className="flex-1 flex flex-col items-center ">
                                {/* Persistent Header Area */}
                                <div className="h-[80px] w-full relative mask-[linear-gradient(to_bottom,white,transparent)] shrink-0">
                                    <ParticleText text="" backgroundBrightness={{ dark: 160, light: 185 }} reverse={true} className="h-full opacity-80 w-full z-20" />
                                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b to-transparent from-brand-500/5 z-10"></div>
                                </div>

                                <div className="flex-1 w-full max-w-4xl -mt-[80px]">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border dark:border-border/40 w-full bg-background relative z-30">
                        <FooterSection />
                    </div>
                </main>
            </div>
        </div>
    )
}
