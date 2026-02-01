"use client"

export default function Navigation() {
    return (
        <nav className="w-full max-w-[1060px] px-6 pt-6 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#1A1A1A] font-sans">SetWise</span>
            </div>

            <div className="hidden md:flex items-center gap-8 bac px-8 py-2.5 rounded-full ">
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">Home</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">How it Works</a>
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">Features</a>
                <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:block ">
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-600/90 cursor-pointer relative overflow-hidden  text-white text-sm font-medium rounded-full transition-all duration-300 transform transform-gpu will-change-transform border border-neutral-300">
                        Try for free
                        <div className="absolute top-0 left-0 w-2/5 translate-y-1/3 -translate-x-1/2 h-full bg-white/30 blur-md rounded-full"></div>
                        <div className="absolute top-0 right-0 w-2/5 -translate-y-1/3 translate-x-1/2 h-full bg-white/30 blur-md rounded-full"></div>
                    </button>
                </div>
            </div>
        </nav>
    )
}
