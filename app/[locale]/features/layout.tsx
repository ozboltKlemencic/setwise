import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import FooterSection from "@/components/footer-section"
import { FeaturesSidebar } from "@/components/features/features-sidebar"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata' })

    return {
        title: `Features - SetWise`,
    }
}

export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full h-screen relative bg-background overflow-x-hidden flex flex-col items-center">


            <div className="w-full flex justify-center">
                <main className="w-[94vw] md:w-6xl relative flex flex-col min-h-screen border-l border-r 
                border-border/50 dark:border-border/40 bg-background">

                    <Navigation />

                    <div className="flex flex-1 flex-col md:flex-row border-t 
                border-border/50 dark:border-border/40">
                        <FeaturesSidebar />

                        <div className="flex-1 w-full min-h-[150vh]">
                            {children}
                        </div>
                    </div>

                    <div className="border-t border-border dark:border-border/40">
                        <FooterSection />
                    </div>
                </main>
            </div>
        </div>
    )
}
