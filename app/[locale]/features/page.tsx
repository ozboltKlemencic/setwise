import { ParticleText } from "@/components/ui/particle-text";


export default function FeaturesPage() {
    return <div className="w-full h-full flex flex-col items-start justify-start">
        <div className="h-[80px] w-full relative mask-[linear-gradient(to_bottom,white,transparent)]">
            <ParticleText text="" backgroundBrightness={{ dark: 160, light: 185 }} reverse={true} className="h-full opacity-80 w-full z-20" />
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b to-transparent from-brand-500/5 z-10"></div>
        </div>
        <div className="w-full px-10">
            <h1 className="text-large-title font-bold text-surface-800 w-full text-left -mt-12 ">Features</h1>
        </div>
    </div>;
}
