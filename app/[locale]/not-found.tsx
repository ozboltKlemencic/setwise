"use client"

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ButtonRotatingGradient from '@/components/ui/buttons/ButtonRotatingGradient'
import { ParticleText } from '@/components/ui/particle-text'
import Navigation from '@/components/navigation'

export default function NotFound() {
    const t = useTranslations('NotFound')

    return (
        <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
            <div className="relative flex flex-col justify-start items-center w-full h-full min-h-screen">
                {/* Navigation matches Home Page */}
                <Navigation />

                {/* Main container with side borders matching Home Page */}
                <div className="md:px-8 lg:px-0 w-[94vw] md:w-6xl max-w-6xl relative flex flex-col justify-center items-center grow border-l border-r border-[#E0DEDB]/80 bg-[#F7F5F3]">

                    <div className="flex flex-col items-center justify-center z-10 -mt-20">
                        <h1 className="text-[120px] font-bold text-neutral-800 leading-none">404</h1>
                        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">{t('title')}</h2>
                        <p className="text-neutral-500 mb-8 max-w-md text-center">{t('description')}</p>

                        <Link href="/">
                            <ButtonRotatingGradient className="px-8!">
                                {t('backHome')}
                            </ButtonRotatingGradient>
                        </Link>
                    </div>

                    {/* Particle Text at bottom */}
                    <div className="absolute bottom-0 w-full h-[300px] flex items-end justify-center pb-10 overflow-hidden pointer-events-none">
                        <ParticleText text="404" className="w-full h-full opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
