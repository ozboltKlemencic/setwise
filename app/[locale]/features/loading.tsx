export default function FeaturesLoading() {
    return (
        <div className="w-full h-full flex flex-col items-start justify-start animate-pulse">
            <div className="w-full px-10 space-y-12 pb-20 mt-12">
                <div className="h-10 w-64 bg-surface-200 dark:bg-surface-300/20 rounded-xl" />

                <div className="space-y-4">
                    <div className="h-8 w-48 bg-surface-200 dark:bg-surface-300/10 rounded-lg" />
                    <div className="h-4 w-full max-w-md bg-surface-100 dark:bg-surface-300/5 rounded" />
                </div>

                <div className="space-y-4">
                    <div className="h-8 w-48 bg-surface-200 dark:bg-surface-300/10 rounded-lg" />
                    <div className="h-4 w-full max-w-sm bg-surface-100 dark:bg-surface-300/5 rounded" />
                </div>
            </div>
        </div>
    );
}
