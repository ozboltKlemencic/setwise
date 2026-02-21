"use client"

import { useTranslations } from "next-intl"
import { ArrowUpRight } from "lucide-react"


function DiscordIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 -28.5 256 256" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M216.856339 16.5966031C200.285002 8.84328665 182.566144 3.2084988 164.041564 0C161.766523 4.11318106 159.108624 9.64549908 157.276099 14.0464379C137.583995 11.0849896 118.072967 11.0849896 98.7430163 14.0464379C96.9108417 9.64549908 94.1925838 4.11318106 91.8971895 0C73.3526068 3.2084988 55.6133949 8.86399117 39.0420583 16.6376612C5.61752293 67.146514 -3.4433191 116.400813 1.08711069 164.955721C23.2560196 181.510915 44.7403634 191.567697 65.8621325 198.148576C71.0772151 190.971126 75.7283628 183.341335 79.7352139 175.300261C72.104019 172.400575 64.7949724 168.822202 57.8887866 164.667963C59.7209612 163.310589 61.5131304 161.891452 63.2445898 160.431257C105.36741 180.133187 151.134928 180.133187 192.754523 160.431257C194.506336 161.891452 196.298154 163.310589 198.110326 164.667963C191.183787 168.842556 183.854737 172.420929 176.223542 175.320965C180.230393 183.341335 184.861538 190.991831 190.096624 198.16893C211.238746 191.588051 232.743023 181.531619 254.911949 164.955721C260.227747 108.668201 245.831087 59.8662432 216.856339 16.5966031ZM85.4738752 135.09489C72.8290281 135.09489 62.4592217 123.290155 62.4592217 108.914901C62.4592217 94.5396472 72.607595 82.7145587 85.4738752 82.7145587C98.3405064 82.7145587 108.709962 94.5189427 108.488529 108.914901C108.508531 123.290155 98.3405064 135.09489 85.4738752 135.09489ZM170.525237 135.09489C157.88039 135.09489 147.510584 123.290155 147.510584 108.914901C147.510584 94.5396472 157.658606 82.7145587 170.525237 82.7145587C183.391518 82.7145587 193.761324 94.5189427 193.539891 108.914901C193.539891 123.290155 183.391518 135.09489 170.525237 135.09489Z" />
        </svg>
    )
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
        </svg>
    )
}

const communityCards = [
    {
        key: "discord",
        icon: DiscordIcon,
        cardClassName: "bg-linear-to-tr from-[#5865f2] to-[#737fff] hover:from-[#4e5bdf] hover:to-[#646fdf] border-[#5865f2]/90 hover:border-[#646fdf]/90",
        link: "https://discord.gg/DnjdKXuK5P",
    },
    {
        key: "facebook",
        icon: FacebookIcon,
        cardClassName: "bg-linear-to-tr from-[#1773ea] to-[#549fff]  hover:from-[#1567d2] hover:to-[#4a89df] border-[#549fff]/90 hover:border-[#4a89df]/90",
        link: "https://www.facebook.com/groups/1962082657986893/",
    },
] as const

export default function CommunityPage() {
    const t = useTranslations("CommunityPage")

    return (
        <div className="w-full h-full flex flex-col items-center justify-start font-sans pt-12 md:pt-12 lg:pt-0">
            <div className="w-full px-(--space-5) md:px-(--space-12) max-w-5xl">
                <header className="pt-(--space-8) pb-(--space-5) md:pt-(--space-16) md:pb-(--space-8) text-center flex flex-col items-center justify-center">
                    <p className="text-caption-2 tracking-wider font-semibold primaryGradient mb-1">
                        {t("badge")}
                    </p>
                    <h1 className="text-title-1 md:text-display-sm lg:text-display font-bold text-center text-surface-900 tracking-tight text-balance md:max-w-115">
                        {t.rich("heading", {
                            primary: (chunks) => <span className="primaryGradient">{chunks}</span>,
                        })}
                    </h1>
                    <p className="mt-(--space-2) md:max-w-sm md:px-(--space-6) text-center md:mt-(--space-3) text-subheadline md:text-callout text-surface-600 max-w-2xl mx-auto leading-relaxed">
                        {t("description")}
                    </p>
                </header>

                <section className="">
                    <div className="relative py-(--space-2) sm:py-(--space-6)">
                        <div className="absolute inset-y-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-b border-surface-200/90 border-t overflow-hidden pointer-events-none">
                            {Array.from({ length: 300 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-200/80 outline-offset-[-0.25px]"
                                    style={{
                                        top: `${i * 16 - 120}px`,
                                        left: "-100%",
                                        width: "300%",
                                    }}
                                />
                            ))}
                        </div>

                        <div className="grid gap-(--space-2) sm:gap-(--space-3) py-(--space-0) md:py-(--space-6) md:grid-cols-2 relative z-10 -mx-(--space-3) md:-mx-(--space-8) justify-center items-center">
                            {communityCards.map(({ key, icon: Icon, cardClassName, link }) => (
                                <a
                                    key={key}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group rounded- border p-(--space-5) md:p-(--space-6) min-h-40 md:min-h-52 max-w-md flex flex-col justify-between transition-colors duration-(--duration-normal) ${cardClassName}`}
                                >
                                    <div className="flex items-start justify-between gap-(--space-3)">
                                        <div className="flex items-center gap-(--space-2)">
                                            <span className="shrink-0 size-10 rounded-md bg-white/16 text-white flex items-center justify-center">
                                                <Icon className="size-4.5" />
                                            </span>

                                            <h2 className="text-subheadline md:text-headline font-semibold text-white tracking-tight">
                                                {t(`cards.${key}.title`)}
                                            </h2>
                                        </div>

                                        <ArrowUpRight className="size-4 text-white/85 group-hover:text-white transition-colors duration-(--duration-fast)" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-footnote md:text-subheadline text-white/90 leading-relaxed max-w-md">
                                            {t(`cards.${key}.description`)}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
