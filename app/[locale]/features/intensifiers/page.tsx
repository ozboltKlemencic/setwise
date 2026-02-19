import { MiniFeatureCard } from "@/components/features/feature-cards"

export { generateMetadata } from './metadata'

const sections = [
    { id: "drop-sets", title: "Drop Sets", description: "Push past failure with integrated drop set tracking." },
    { id: "supersets", title: "Supersets", description: "Log paired exercises without switching screens." },
    { id: "cluster-sets", title: "Cluster Sets", description: "Advanced set types for serious strength training." },
] as const

export default function IntensifiersPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl min-[1152px]:border-0 md:border-l md:border-r border-surface-200">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-10) min-[1152px]:pr-(--space-8)">
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        Intensifiers
                    </h1>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-10) md:space-y-(--space-16) lg:space-y-(--space-20) pb-(--space-10) md:pb-(--space-16)">

                    {sections.map(({ id, title, description }) => (
                        <section key={id} id={id} className="scroll-mt-32">
                            <MiniFeatureCard compact title={title} description={description} />
                        </section>
                    ))}

                </div>
            </div>
        </div>
    )
}
