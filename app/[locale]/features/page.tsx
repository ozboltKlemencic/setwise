import { ParticleText } from "@/components/ui/particle-text";


export default function FeaturesPage() {
    return <div className="w-full h-full flex flex-col items-start justify-start">
        <div className="h-[200px] w-full ">
            <ParticleText text="" className="h-full w-full bg-red-500/5" />
        </div>
        <h1 className="text-4xl font-bold">Features</h1>

    </div>;
}
