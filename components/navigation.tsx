"use client"

import ButtonRotatingGradient from "./ui/buttons/ButtonRotatingGradient"

export default function Navigation() {
    return (
        <nav className="w-full max-w-6xl px-8 pt-6 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#1A1A1A] font-sans">SetWise</span>
            </div>

            <div className="hidden md:flex items-center gap-8 bac px-8 py-2.5 rounded-full ">
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">Home</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">How it Works</a>
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">Features</a>
                <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">Pricing</a>
            </div>


            <ButtonRotatingGradient />

        </nav>
    )
}
