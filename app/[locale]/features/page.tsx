import { Link } from "@/i18n/navigation"
import { Check, Zap, LayoutTemplate, History, TrendingUp, ShieldCheck } from "lucide-react"
import {
    FeatureCard,
    KeyFeatureSection,
    MiniFeatureCard,
    StepCard,
    SecurityItem,
    BenefitBadge,
    FeatureTextBlock,
    SectionDivider,
} from "@/components/features/feature-cards"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"



// -- Data Arrays --------------------------------------------------

const overviewCards = [
    {
        icon: Zap,
        title: "Bliskovito Hitro",
        description: "Dodajte serijo z le 2 klikoma. Med seti ste manj na telefonu in več skoncentrirani na dvigovanje.",
    },
    {
        icon: ShieldCheck,
        title: "Offline-First Pristop",
        description: "Trenirate v fitnesu brez signala? SetWise deluje popolnoma offline. Vaš trening se nikoli ne ustavi.",
    },
    {
        icon: TrendingUp,
        title: "Auto-Compare",
        description: "Vsaka vaja prikaže vašo prejšnjo izvedbo in all-time rekord. Veste točno, kaj morate preseči.",
    },
    {
        icon: History,
        title: "Napredna Analitika",
        description: "Volume charts, strength curves, muscle heatmap in RPE tracking za resen napredek.",
    },
]

const advancedCards = [
    { title: "Drop & Supersets", description: "Sistem avtomatsko poveže sete ter spremlja total volume." },
    { title: "Auto-Compare", description: "Real-time feedback med live sessionom (\"+5kg več kot prejšnjič\")." },
    { title: "Cloud Sync", description: "End-to-end enkripcija, multi-device support in backup." },
    { title: "Exercise Library", description: "800+ vaj z video demonstracijami." },
]

const steps = [
    { title: "Start Workout", description: "Tapnite gumb na domačem ekranu, izberite template ali empty workout." },
    { title: "Dodajte vaje", description: "Izberite vajo (npr. Bench Press), vidite zgodovino in PR." },
    { title: "Beležite sete", description: "Vnesite težo in repse. Rest timer začne odštevati avtomatsko." },
]

const benefits = [
    "Lifetime Free",
    "Premium Features",
    "Direct Feedback",
    "Early Access",
]

const securityItems = [
    {
        icon: ShieldCheck,
        title: "End-to-End Enkripcija",
        description: "Vsi podatki so šifrirani pri sinhronizaciji (256-bit).",
    },
    {
        icon: ShieldCheck,
        title: "Local-First Storage",
        description: "Podatki so na vaši napravi. Account ni obvezen.",
    },
]

// -- Page Component -----------------------------------------------

export default function FeaturesPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans">
            <div className="w-full px-(--space-6) md:px-(--space-12) max-w-5xl">

                {/* ── Page Header ────────────────────────────── */}
                <header className="pt-(--space-12) pb-(--space-8) md:pt-(--space-16) md:pb-(--space-10)">
                 
                        <p className="text-caption-2 uppercase tracking-wider font-semibold primaryGradient mb-1">
                            Funkcije
                        </p>
                  
                    <h1 className="text-large-title md:text-display-sm lg:text-display font-bold text-surface-900 tracking-tight text-balance">
                        Vse kar potrebujete v{" "}
                        <span className="primaryGradient">SetWise</span>{" "}
                        appu
                    </h1>
                </header>

                {/* ── Sections ───────────────────────────────── */}
                <div className="space-y-(--space-16) lg:space-y-(--space-20) ">

                    {/* OVERVIEW Section */}
                    <section id="overview" className="scroll-mt-32  space-y-(--space-8)">
                        <div className="space-y-(--space-3)">
                            <h2 className="text-title-1 md:text-large-title font-bold text-surface-900 tracking-tight">
                                Overview
                            </h2>
                           
                            <p className="text-callout md:text-body text-surface-700 leading-relaxed max-w-prose">
                                SetWise je{" "}
                                <strong className="text-surface-900 font-semibold">workout tracker aplikacija</strong>{" "}
                                za iPhone, zasnovana okoli enega preprostega principa:{" "}
                                <strong className="text-surface-900 font-semibold">hitro beleženje, pametna analitika, realen napredek</strong>.
                                Trenutno v <strong className="text-surface-900 font-semibold">beta fazi</strong>,
                                SetWise že zdaj ponuja najbolj intuitivno izkušnjo beleženja treninga –
                                prilagojeno za atlete, bodybuilderje in fitness navdušence,
                                ki želijo maksimalno izkoristiti vsak trening.
                            </p>
                        </div>

                        {/* Cards with full-bleed decorative background */}
                        <div className="relative">
                            {/* Decorative lines — breaks out of parent padding to span full width */}
                            <div className="absolute inset-0 -mx-(--space-6) border-b border-surface-200 border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200 outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Cards grid — on top of decorative background */}
                            <div className="grid md:grid-cols-2 gap-(--space-4) py-(--space-4) md:py-(--space-6)  md:gap-(--space-2) w-full relative z-10">
                                {overviewCards.map((card) => (
                                    <FeatureCard
                                        key={card.title}
                                        icon={card.icon}
                                        title={card.title}
                                        description={card.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>      

                    {/* KEY FEATURES Section */}
                    <section id="key-features" className="scroll-mt-32 space-y-(--space-16)">
                        <div className="space-y-(--space-2)">
                            <p className="text-caption-1 uppercase tracking-wider font-semibold primaryGradient">
                                Podrobnosti
                            </p>
                            <h2 className="text-title-1 md:text-large-title font-bold text-surface-900 tracking-tight">
                                Key Features
                            </h2>
                        </div>

                        {/* Feature 1 — Quick Logging */}
                        <KeyFeatureSection icon={Zap} title="Quick Logging">
                            <div className="space-y-(--space-4) max-w-prose">
                                <FeatureTextBlock lead="Live Session Mode">
                                    omogoča beleženje vsake serije brez preklapljanja med ekrani.
                                    Odprete trening, vidite zgodovino in PR za vsako vajo, vnesete težo in repse, tapnete{" "}
                                    <span className="inline-flex px-1.5 py-0.5 rounded-md bg-surface-200/80 dark:bg-surface-300/30 text-surface-900 text-caption-1 font-mono">
                                        ✓
                                    </span>.
                                    Med seti vas <strong className="text-surface-900 font-semibold">vgrajen rest timer</strong>{" "}
                                    opozori, ko je čas za naslednjo serijo.
                                </FeatureTextBlock>
                                <FeatureTextBlock lead="Manual Log Entry">
                                    omogoča dodajanje preteklih treningov. Pozabili ste zabeleži včeraj?
                                    Enostavno dodate datum, vaje in serije – sistem posodobi vse statistike.
                                </FeatureTextBlock>
                                <FeatureTextBlock lead="Smart Plates Calculator">
                                    izračuna točno kombinacijo plošč za ciljno težo
                                    (npr. &quot;2× 20kg + 2× 15kg + 2× 2.5kg = 95kg&quot;).
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 2 — Templates & Programs */}
                        <KeyFeatureSection icon={LayoutTemplate} title="Templates & Programs">
                            <div className="space-y-(--space-4) max-w-prose">
                                <FeatureTextBlock lead="My Templates">
                                    so vaši shranjeni workouts. Ustvarite &quot;Push Day&quot; predlogo z vsemi vajami,
                                    in vsak teden jo odprete – vse vaje so tam z zgodovino in PR-ji.
                                </FeatureTextBlock>
                                <FeatureTextBlock lead="Public Programs">
                                    vključujejo preizkušene programe: Starting Strength, StrongLifts 5×5,
                                    PPL Split, Upper/Lower Split. Vsak program ima navodila, set/rep schemes
                                    in avtomatsko progresijo.
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 3 — History & Personal Records */}
                        <KeyFeatureSection icon={History} title="History & Personal Records">
                            <div className="space-y-(--space-4) max-w-prose">
                                <FeatureTextBlock lead="Workout Log">
                                    shranjuje vse vaše treninge z datumom, volumnom, trajanjem in hitrim predogledom.
                                </FeatureTextBlock>
                                <FeatureTextBlock lead="Personal Records">
                                    avtomatsko zaznava PR-je: 1RM (one rep max), Volume PR, Total Weight PR.
                                    Ob novem rekordu vas SetWise čestita.
                                </FeatureTextBlock>
                                <FeatureTextBlock lead="Calendar View">
                                    prikazuje mesečni koledar treningov z barvnimi oznakami
                                    (zelena = visok volumen, rumena = krajši workout, siva = rest day).
                                </FeatureTextBlock>
                            </div>
                        </KeyFeatureSection>

                        {/* Feature 4 — Progress & Analytics */}
                        <KeyFeatureSection icon={TrendingUp} title="Progress & Analytics">
                            <ul className="list-none space-y-(--space-3) max-w-prose">
                                {[
                                    { lead: "Volume Charts", text: "Prikazujejo celoten volumen. Linearno povečanje pomeni napredek." },
                                    { lead: "Strength Curves", text: "Izračunajo estimated 1RM (Epley & Brzycki) in prikažejo rast." },
                                    { lead: "Muscle Heatmap", text: "3D vizualizacija mišičnih skupin in intenzivnosti." },
                                    { lead: "RPE/RIR Tracking", text: "Beleženje Rate of Perceived Exertion (1-10 scale)." },
                                ].map((item) => (
                                    <li key={item.lead} className="flex gap-(--space-3) text-callout md:text-body text-surface-700 leading-relaxed">
                                        <span className="mt-1.5 size-1.5 rounded-full bg-surface-900 shrink-0" />
                                        <span>
                                            <strong className="text-surface-900 font-semibold">{item.lead}:</strong>{" "}
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </KeyFeatureSection>

                        {/* Feature 5 — Advanced Features */}
                        <KeyFeatureSection icon={Zap} title="Advanced Features">
                            <div className="relative py-(--space-4) md:py-(--space-6)">
                                {/* Decorative lines — breaks out of all parent padding to span full width */}
                                <div className="absolute inset-0 -mx-(--space-6) md:-ml-25 md:-mr-(--space-12) border-b border-surface-200 border-t md:-mx-(--space-12) overflow-hidden pointer-events-none">
                                    {Array.from({ length: 300 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/70 outline-offset-[-0.25px]"
                                            style={{
                                                top: `${i * 16 - 120}px`,
                                                left: "-100%",
                                                width: "300%",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Cards grid — on top of decorative background */}
                                <div className="grid md:grid-cols-2 gap-(--space-2) relative z-10">
                                    {advancedCards.map((card) => (
                                        <MiniFeatureCard
                                            key={card.title}
                                            title={card.title}
                                            description={card.description}
                                        />
                                    ))}
                                </div>
                            </div>
                        </KeyFeatureSection>
                    </section>

                    {/* GET STARTED Section */}
                    <section id="get-started" className="scroll-mt-32 space-y-(--space-12) mb-(--space-16) md:mb-(--space-20)">
                        <div className="space-y-(--space-2)">
                            <p className="text-caption-1 uppercase tracking-wider font-semibold primaryGradient">
                                Začnite
                            </p>
                            <h2 className="text-title-1 md:text-large-title font-bold text-surface-900 tracking-tight flex items-center gap-(--space-3)">
                                Get Started
                            </h2>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-linear-to-tr from-brand-500/15 to-brand-500/5 border border-brand-200 relative rounded-xl overflow-hidden shadow-(--shadow-sm) ">
                            {/* Decorative lines — behind content */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none mask-[radial-gradient(300px_circle_at_center,white,transparent)]">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-300/80 dark:outline-surface-400/30 outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Content — on top of decorative lines */}
                            <div className="relative z-10 p-(--space-6) md:p-(--space-8) ">
                                <h3 className="text-title-3 md:text-title-2 font-bold text-surface-900 mb-(--space-2)">
                                    Beta Access – Brezplačno za Zgodnje Uporabnike
                                </h3>
                                <p className="text-callout md:text-body text-surface-700 mb-(--space-8) max-w-prose">
                                    SetWise je v <strong className="text-surface-900 font-semibold">closed beta</strong>.
                                    Beta testerji obdržijo <strong className="text-surface-900 font-semibold">lifetime free access</strong> po izidu.
                                </p>

                                <div className="grid gap-(--space-4) sm:grid-cols-2 lg:grid-cols-4 mb-(--space-8)">
                                    {benefits.map((label) => (
                                        <BenefitBadge key={label} icon={Check} label={label} />
                                    ))}
                                </div>

                                <BetaSignupDialog trigger={<ButtonRotatingGradient>Pridruži se Beta Programu</ButtonRotatingGradient>} />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="grid md:grid-cols-3 gap-(--space-8) md:gap-(--space-10)">
                            {steps.map((step, i) => (
                                <StepCard
                                    key={step.title}
                                    step={i + 1}
                                    title={step.title}
                                    description={step.description}
                                />
                            ))}
                        </div>
                    </section>

                   

                    {/* SECURITY & PRIVACY Section */}
                    <section className="scroll-mt-32 relative  ">
                        {/* Decorative lines — behind content, full width */}
                        <div className="absolute inset-0 -mx-(--space-6) md:-mx-(--space-12) border-t border-surface-200/80 dark:border-surface-300/60 overflow-hidden pointer-events-none">
                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/70 outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 120}px`,
                                        left: "-100%",
                                        width: "300%",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Content — on top */}
                        <div className="relative z-10 space-y-(--space-8) p-(--space-6) md:py-(--space-20)">
                            <div className="space-y-(--space-2)">
                                <p className="text-caption-1 uppercase tracking-wider font-semibold text-surface-500">
                                    Varnost
                                </p>
                                <h2 className="text-title-2 md:text-title-1 font-bold text-surface-900 tracking-tight">
                                    Security & Privacy
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-(--space-6) md:gap-(--space-8)">
                                {securityItems.map((item) => (
                                    <SecurityItem
                                        key={item.title}
                                        icon={item.icon}
                                        title={item.title}
                                        description={item.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
