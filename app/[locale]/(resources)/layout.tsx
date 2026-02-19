"use client"

import Navigation from "@/components/navigation"
import FooterSection from "@/components/footer-section"
import { ParticleText } from "@/components/ui/particle-text"
import { usePathname } from "@/i18n/navigation"

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const isGuidesRoute = pathname === "/guides" || pathname.startsWith("/guides/")
    if (isGuidesRoute) {
        return <>{children}</>
    }

    return (
        <div className="w-full min-h-screen relative bg-background flex flex-col items-center">
            <div className="w-full flex justify-center flex-1">
                <main className="w-[94vw] md:w-6xl  flex flex-col relative overflow-hidden border-l border-r 
                border-border/50 dark:border-border/40 bg-background">


                    <Navigation />


                    <div className="flex-1 flex flex-col items-center md:max-w-6xl relative">
                        {/* Header Effect area matching Features design */}
                        <div className="h-[80px] w-full relative mask-[linear-gradient(to_bottom,white,transparent)] shrink-0">
                            <ParticleText text="" backgroundBrightness={{ dark: 160, light: 185 }} reverse={true} className="h-full min-h-0 opacity-80 w-full z-20" />
                            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b to-transparent from-brand-500/5 z-10"></div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full relative z-10 max-w-3xl -mt-[60px]">
                            {children}
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
