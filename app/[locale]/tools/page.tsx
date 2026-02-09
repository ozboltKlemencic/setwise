import { useTranslations } from 'next-intl';

export default function ToolsPage() {
    const t = useTranslations('ToolsPage');

    return (
        <main className="w-full flex-col flex items-center justify-center min-h-screen bg-background">
            <div className="container px-(--space-4) py-(--space-20) mx-auto flex flex-col items-center justify-center gap-(--space-8)">
                <h1 className="text-large-title font-bold text-center text-surface-900 font-sans">
                    {t('title')}
                </h1>
                <p className="text-body text-center text-surface-500 max-w-2xl font-sans">
                    {t('description')}
                </p>
            </div>
        </main>
    );
}
