export default function HistoryPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">History</h1>

                <section id="workout-log" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Workout Log</h2>
                    <p className="text-muted-foreground">Review every session you've ever tracked.</p>
                </section>

                <section id="personal-records" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Personal Records</h2>
                    <p className="text-muted-foreground">Track your all-time bests across all exercises.</p>
                </section>

                <section id="calendar" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Calendar</h2>
                    <p className="text-muted-foreground">Visualize your training frequency and consistency.</p>
                </section>
            </div>
        </div>
    );
}
