import FooterSection from '@/components/footer-section'
import Navigation from '@/components/navigation'
import { ParticleText } from '@/components/ui/particle-text'

export { generateMetadata } from './metadata'

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-full  relative flex flex-col items-center">



        {children}


    </div>
}
