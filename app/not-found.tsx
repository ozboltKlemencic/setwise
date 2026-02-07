"use client"

import Link from 'next/link'
import ButtonRotatingGradient from '@/components/ui/buttons/ButtonRotatingGradient'
import { ParticleText } from '@/components/ui/particle-text'

// Root 404 page - Static (no translations/provider guaranteed)
export default function NotFound() {
    return (
        <div className="w-full h-dvh md:h-screen relative bg-[#F7F5F3] mask-[radial-gradient(350px_circle_at_center,white,transparent)] md:mask-[radial-gradient(700px_circle_at_center,white,transparent)] overflow-x-hidden flex flex-col justify-start items-center">
            <div className="relative flex flex-col justify-start items-center w-full h-full min-h-screen">


                {/* Main container with side borders matching Home Page */}
                <div className="md:px-8 lg:px-0  md:w-6xl max-w-6xl relative flex flex-col justify-center items-center grow border-l border-r border-[#E0DEDB]/80 bg-[#F7F5F3]">
                    <div className='border-b py-28 border-t flex items center justify-center border-[#E0DEDB]/80 w-full z-20'>
                        <div className="flex flex-col items-center justify-center z-10  w-[94vw]">
                            <h1 className="text-[130px] md:text-[220px] font-bold text-neutral-800 leading-none">404</h1>
                            <h2 className="text-lg md:text-2xl font-semibold text-neutral-700">Stran ni najdena</h2>
                            <p className="text-neutral-500 mb-5 max-w-md text-sm md:text-base text-center">Stran, ki jo iščeš, ne obstaja.</p>

                            <Link href="/">
                                <ButtonRotatingGradient onClick={() => { window.location.href = "/" }} className="">
                                    Nazaj domov
                                </ButtonRotatingGradient>
                            </Link>
                        </div>
                    </div>
                    {/* Particle Text at bottom */}

                </div>
            </div>
            <div className="absolute bottom-10  w-full h-[500px] md:h-[900px]  flex items-end justify-center overflow-hidden pointer-events-none">
                <ParticleText text="404" fontSize={460} fontSizeMobile={180} className="w-full h-full opacity-70 md:opacity-50  z-10" />
            </div>
        </div>
    )
}
