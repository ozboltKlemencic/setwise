export default function FeaturesPage() {
    return <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full px-6 md:px-12 space-y-12 pb-20">
            <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Features</h1>

            <section id="overview" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground">SetWise is designed to be the fastest, most intuitive workout tracker on the market.</p>
            </section>

            <section id="key-features" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <p className="text-muted-foreground">Built-in rest timers, automatic plate calculators, and intelligent exercise suggestions.</p>
            </section>

            <section id="get-started" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Get Started</h2>
                <p className="text-muted-foreground">Download the app today and start tracking your journey to a stronger you.</p>
            </section>
        </div>
    </div>;
}
