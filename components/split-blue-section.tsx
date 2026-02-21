"use client"

import React from "react"
import ProfileCard from "./ui/cards/ProfileCard"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import DownloadButton from "./ui/buttons/DownloadButton";
import { useTranslations } from "next-intl"

interface TeamMember {
    name: string
    title: string
    handle: string
    linkedinUrl?: string
    avatarUrl: string
    miniAvatarUrl: string
    status: string
}

export default function SplitBlueSection() {
    const t = useTranslations('SplitBlue')

    const translatedMembers = t.raw('teamMembers') as Array<{ name: string; title: string; handle: string; linkedinUrl?: string }>

    const teamMembers: TeamMember[] = translatedMembers.map((member) => ({
        ...member,
        avatarUrl: member.name === "Jernej Peternel" ? "/team/jernej-peternel.png" : "/team/ozbolt-klemencic.png",
        miniAvatarUrl: member.name === "Jernej Peternel" ? "/team/jernej-peternel.png" : "/team/ozbolt-klemencic.png",
        status: "Online"
    }))

    return (
        <div className="w-full flex flex-col py-(--space-10) md:pt-(--space-20) md:pb-(--space-10) md:min-h-150 lg:flex-row justify-between items-center">

            {/* ── Text Section ── */}
            <div className="w-full lg:w-1/2 pt-(--space-6) md:pt-(--space-10) px-(--space-6) md:px-(--space-10) lg:pl-(--space-20) lg:pr-(--space-12) pb-(--space-10) md:pb-(--space-8) lg:pb-28 flex flex-col justify-start h-full items-center lg:items-start gap-(--space-6)">
                <div className="self-stretch flex flex-col justify-start items-center lg:items-start gap-(--space-3)">

                    {/* Title — Apple HIG responsive typography */}
                    <h3 className="text-center lg:text-left text-surface-900 text-title-1 md:text-large-title lg:text-display font-semibold font-sans">
                        {t('headline')} <span className="font-bold primaryGradient">{t('headlineHighlight')}</span>{t('headlineRest')}
                    </h3>

                    {/* Description — Apple HIG subheadline/callout */}
                    <p className="self-stretch text-center lg:text-left text-surface-600 text-subheadline md:text-callout font-sans font-medium">
                        {t('description')}
                    </p>
                </div>

                <div className="w-full max-w-124.25 flex flex-col justify-start items-center lg:items-start gap-(--space-12)">
                    <div className="flex justify-start items-center gap-(--space-4)">
                        <DownloadButton openBetaDialog={true} text={t('button')} />
                    </div>
                </div>
            </div>

            {/* ── Static Cards Grid — md only ── */}
            <div className="hidden md:flex lg:hidden w-full justify-center gap-(--space-4) px-(--space-10) pb-(--space-10)">
                {teamMembers.map((member, index) => (
                    <div key={index} className="w-full max-w-64">
                        <ProfileCard
                            avatarUrl={member.avatarUrl}
                            miniAvatarUrl={member.miniAvatarUrl}
                            name={member.name}
                            title={member.title}
                            handle={member.handle}
                            linkedinUrl={member.linkedinUrl}
                            status={member.status}
                            contactText={t('contactText')}
                            showUserInfo={true}
                            onContactClick={() => console.log(`Contact clicked for ${member.name}`)}
                        />
                    </div>
                ))}
            </div>

            {/* ── Carousel Section — mobile & lg+ ── */}
            <div className="w-full lg:w-1/2 relative overflow-hidden mr-0.5 md:hidden lg:block">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent className="px-(--space-4)">
                        {teamMembers.map((member, index) => (
                            <CarouselItem key={index} className="basis-[80%] lg:basis-[55%] px-(--space-3) lg:px-(--space-4) py-(--space-2)">
                                <ProfileCard
                                    avatarUrl={member.avatarUrl}
                                    miniAvatarUrl={member.miniAvatarUrl}
                                    name={member.name}
                                    title={member.title}
                                    handle={member.handle}
                                    linkedinUrl={member.linkedinUrl}
                                    status={member.status}
                                    contactText={t('contactText')}
                                    showUserInfo={true}
                                    onContactClick={() => console.log(`Contact clicked for ${member.name}`)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Carousel controls */}
                    <div className="flex justify-end gap-(--space-2) mt-(--space-6) lg:mt-(--space-8) pr-(--space-4)">
                        <CarouselPrevious className="static translate-y-0 rounded-xs cursor-pointer translate-x-0 size-10 border-surface-200 dark:border-surface-300 hover:bg-surface-50 dark:hover:bg-surface-200 transition-colors duration-(--duration-fast) ease-(--ease-apple)" />
                        <CarouselNext className="static translate-y-0 rounded-xs cursor-pointer translate-x-0 size-10 border-surface-200 dark:border-surface-300 hover:bg-surface-50 dark:hover:bg-surface-200 transition-colors duration-(--duration-fast) ease-(--ease-apple)" />
                    </div>
                </Carousel>
            </div>
        </div>
    );
}
