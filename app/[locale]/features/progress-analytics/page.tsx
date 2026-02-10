export default function ProgressAnalyticsPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Progress & Analytics</h1>

                <section id="volume-charts" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Volume Charts</h2>
                    <p className="text-muted-foreground">See how your training volume changes over time.</p>
                </section>

                <section id="strength-curves" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Strength Curves</h2>
                    <p className="text-muted-foreground">Track your strength gains across key lifts.</p>
                </section>

                <section id="muscle-heatmap" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Muscle Heatmap</h2>
                    <p className="text-muted-foreground">Visualize which muscle groups you're prioritizing.</p>
                </section>
            </div>
        </div>
    );
}
