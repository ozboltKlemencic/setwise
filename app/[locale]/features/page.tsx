"use client"

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ButtonRotatingGradient from '@/components/ui/buttons/ButtonRotatingGradient'
import { ParticleText } from '@/components/ui/particle-text'

export default function FeaturesPage() {
    const t = useTranslations('ComingSoon')

    return (
        <div className="w-full h-dvh md:h-screen relative bg-surface-50 mask-[radial-gradient(500px_circle_at_center,white,transparent)] md:mask-[radial-gradient(560px_circle_at_center,white,transparent)] overflow-x-hidden flex flex-col justify-start items-center transition-colors duration-normal">
            <div className="relative flex flex-col justify-start items-center w-full h-full min-h-screen">

                {/* Main container with side borders matching Home Page */}
                <div className="md:px-8 lg:px-0 md:w-6xl max-w-6xl relative flex flex-col justify-center items-center grow border-l border-r border-border bg-surface-50 transition-colors duration-normal">
                    <div className='border-b py-24 md:py-32 border-t flex items-center justify-center border-border w-full z-20 transition-colors duration-normal'>
                        <div className="flex flex-col items-center justify-center z-10 w-[94vw] text-center">
                            <h1 className="text-[60px] md:text-[100px] font-bold text-surface-900 leading-none tracking-tighter select-none px-4">
                                {t('title')}
                            </h1>
                            <h2 className="text-xl md:text-2xl font-semibold text-surface-700 mt-3 md:mt-4">
                                {t('subtitle')}
                            </h2>
                            <p className="text-surface-600 mb-5 max-w-md text-base md:text-lg text-center mt-1 px-8 leading-relaxed">
                                {t('description')}
                            </p>

                            <Link href="/">
                                <ButtonRotatingGradient onClick={() => { window.location.href = "/" }}>
                                    {t('backHome')}
                                </ButtonRotatingGradient>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Particle Text at bottom */}
            <div className="absolute bottom-0 w-full h-[400px] md:h-[600px] flex items-end justify-center overflow-hidden pointer-events-none">
                <ParticleText
                    text={t('particleText')}
                    fontSize={300}
                    fontSizeMobile={120}
                    className="w-full h-full opacity-60 md:opacity-40 z-10"
                />
            </div>
        </div>
    )
}
