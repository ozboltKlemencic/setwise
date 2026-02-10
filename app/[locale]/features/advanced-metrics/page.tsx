export default function AdvancedMetricsPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">RPE/RIR, Tempo/ROM</h1>

                <section id="exertion-scale" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Exertion Scale</h2>
                    <p className="text-muted-foreground">Track intensity using RPE (Rate of Perceived Exertion) and RIR (Reps in Reserve).</p>
                </section>

                <section id="rep-quality" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Rep Quality</h2>
                    <p className="text-muted-foreground">Log Tempo and Range of Motion for every set.</p>
                </section>

                <section id="advanced-metrics" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Advanced Metrics</h2>
                    <p className="text-muted-foreground">Deep dive into the specifics of your lifting performance.</p>
                </section>
            </div>
        </div>
    );
}
