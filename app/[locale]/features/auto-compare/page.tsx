export default function AutoComparePage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Auto-compare</h1>

                <section id="vs-last-session" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">vs Last Session</h2>
                    <p className="text-muted-foreground">Instantly see how your current set compares to your last workout.</p>
                </section>

                <section id="vs-best-all-time" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">vs Best All-Time</h2>
                    <p className="text-muted-foreground">Chasing a PR? We'll show you exactly what beats your best.</p>
                </section>
            </div>
        </div>
    );
}
