"use client"

import Link from 'next/link'
import ButtonRotatingGradient from '@/components/ui/buttons/ButtonRotatingGradient'
import { ParticleText } from '@/components/ui/particle-text'

// Root 404 page - Static (no translations/provider guaranteed)
export default function NotFound() {
    return (
        <div className="w-full min-h-screen relative bg-[#F7F5F3] [mask-image:radial-gradient(700px_circle_at_center,white,transparent)] overflow-x-hidden flex flex-col justify-start items-center">
            <div className="relative flex flex-col justify-start items-center w-full h-full min-h-screen">


                {/* Main container with side borders matching Home Page */}
                <div className="md:px-8 lg:px-0 w-[94vw] md:w-6xl max-w-6xl relative flex flex-col justify-center items-center grow border-l border-r border-[#E0DEDB]/80 bg-[#F7F5F3]">
                    <div className='border-b py-28 border-t border-[#E0DEDB]/80 w-full z-20'>
                        <div className="flex flex-col items-center justify-center z-10 ">
                            <h1 className="text-[220px] font-bold text-neutral-800 leading-none">404</h1>
                            <h2 className="text-2xl font-semibold text-neutral-700 mb-0.5">Stran ni najdena</h2>
                            <p className="text-neutral-500 mb-5 max-w-md text-center">Stran, ki jo iščeš, ne obstaja.</p>

                            <Link href="/">
                                <ButtonRotatingGradient className="">
                                    Nazaj domov
                                </ButtonRotatingGradient>
                            </Link>
                        </div>
                    </div>
                    {/* Particle Text at bottom */}

                </div>
            </div>
            <div className="absolute bottom-0 w-full h-[900px]  flex items-end justify-center overflow-hidden pointer-events-none">
                <ParticleText text="404" fontSize={460} className="w-full h-full opacity-50 z-10" />
            </div>
        </div>
    )
}
