export default function TemplatesProgramsPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full px-6 md:px-12 space-y-12 pb-20">
                <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Templates & Programs</h1>

                <section id="my-templates" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">My Templates</h2>
                    <p className="text-muted-foreground">Manage and use your personalized workout templates.</p>
                </section>

                <section id="public-programs" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Public Programs</h2>
                    <p className="text-muted-foreground">Explore and follow programs created by the community.</p>
                </section>

                <section id="create-new" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4">Create New</h2>
                    <p className="text-muted-foreground">Design your own routines from scratch with ease.</p>
                </section>
            </div>
        </div>
    );
}
