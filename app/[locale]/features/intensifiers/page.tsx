export default function IntensifiersPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Intensifiers</h1>

                <section id="drop-sets" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Drop Sets</h2>
                    <p className="text-muted-foreground">Push past failure with integrated drop set tracking.</p>
                </section>

                <section id="supersets" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Supersets</h2>
                    <p className="text-muted-foreground">Log paired exercises without switching screens.</p>
                </section>

                <section id="cluster-sets" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Cluster Sets</h2>
                    <p className="text-muted-foreground">Advanced set types for serious strength training.</p>
                </section>
            </div>
        </div>
    );
}
