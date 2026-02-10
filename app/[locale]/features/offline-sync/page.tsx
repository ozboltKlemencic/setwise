export default function OfflineSyncPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Offline-first + Sync</h1>

                <section id="offline-mode" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Offline Mode</h2>
                    <p className="text-muted-foreground">Log your workout even in gyms with zero signal. No data lost.</p>
                </section>

                <section id="cloud-sync" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Cloud Sync</h2>
                    <p className="text-muted-foreground">Your data is safely backed up and synced across all your devices.</p>
                </section>

                <section id="data-export" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Data Export</h2>
                    <p className="text-muted-foreground">Export your workout history to CSV or JSON whenever you want.</p>
                </section>
            </div>
        </div>
    );
}
