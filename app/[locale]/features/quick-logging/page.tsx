export default function QuickLoggingPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Quick logging</h1>

                <section id="live-session" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Live Session</h2>
                    <p className="text-muted-foreground">Track your workout in real-time with our live session feature.</p>
                </section>

                <section id="log-manually" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Log Manually</h2>
                    <p className="text-muted-foreground">Quickly enter your sets and reps after your workout.</p>
                </section>

                <section id="rest-timer" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Rest Timer</h2>
                    <p className="text-muted-foreground">Stay on track with customizable timers between sets.</p>
                </section>
            </div>
        </div>
    );
}
