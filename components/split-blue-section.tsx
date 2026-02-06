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

const teamMembers = [

    {
        name: "Jernej Peternel",
        title: "Co-Founder",
        handle: "Jernej.fit",
        avatarUrl: "/jernej.png",
        miniAvatarUrl: "/jernej.png",
        status: "Online"
    },
    {
        name: "Jernej Peternel",
        title: "Developer",
        handle: "Jernej.fit",
        avatarUrl: "/jernej.png",
        miniAvatarUrl: "/jernej.png",
        status: "Online"
    }
];

export default function SplitBlueSection() {
    return (
        <div className="w-full flex flex-col py-10 md:pt-20 md:pb-10 md:min-h-[600px] lg:flex-row justify-between items-center">
            <div className="w-full lg:w-1/2 pt-6 md:pt-10 px-6 md:pl-20 pb-10 md:pb-28 md:pr-12 flex flex-col justify-start h-full items-center md:items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-center md:items-start gap-3">
                    <h3 className="text-center md:text-left text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
                        Built by <span className="font-bold px-1 pl-1 bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">lifters</span>, for lifters.
                    </h3>
                    <p className="self-stretch text-center md:text-left text-[#605A57] text-base leading-7 font-sans font-medium">
                        SetWise is built with passion and tested in real workouts - refined through feedback and improved with every update.
                    </p>
                </div>
                <div className="w-full max-w-[497px] flex flex-col justify-start items-center md:items-start gap-12">
                    <div className="flex justify-start items-center gap-4">
                        <div className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
                            <div className="w-44 h-[41px] absolute left-0 top-0 bg-linear-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                            <div className="flex flex-col justify-center text-white text-[13px] font-medium leading-5 font-sans">
                                Download for free
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 relative overflow-hidden mr-[2px]">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent className="px-2">
                        {teamMembers.map((member, index) => (
                            <CarouselItem key={index} className="basis-[80%] md:basis-[55%] px-4 py-2">
                                <ProfileCard
                                    avatarUrl={member.avatarUrl}
                                    miniAvatarUrl={member.miniAvatarUrl}
                                    name={member.name}
                                    title={member.title}
                                    handle={member.handle}
                                    status={member.status}
                                    contactText="Sledi mi"
                                    showUserInfo={true}
                                    onContactClick={() => console.log(`Contact clicked for ${member.name}`)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-6 md:mt-8 pr-4">
                        <CarouselPrevious className="static translate-y-0 rounded-xs cursor-pointer translate-x-0 h-10 w-10 border-gray-200 hover:bg-gray-50" />
                        <CarouselNext className="static translate-y-0 rounded-xs cursor-pointer translate-x-0 h-10 w-10 border-gray-200 hover:bg-gray-50" />
                    </div>
                </Carousel>
            </div>

        </div>
    );
}
