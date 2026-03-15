"use client"

import * as React from "react"
import {
  IconActivityHeartbeat,
  IconChefHat,
  IconClipboardList,
  IconInfoCircle,
  IconPill,
  IconRepeat,
  IconSettings,
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavDocuments } from "@/components/coachWise/sidebar/nav-documents"
import { NavMain } from "@/components/coachWise/sidebar/nav-main"
import { NavSecondary } from "@/components/coachWise/sidebar/nav-secondary"
import { NavUser } from "@/components/coachWise/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { NavVprasalniki } from "./vprasalniki"

const data = {
  user: {
    name: "Jernej Ficko",
    email: "jernej.123@gmmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Stranke",
      url: "/beta-coach-wise",
      icon: IconUsersGroup,
      exact: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/beta-coach-wise/settings",
      icon: IconSettings,
      exact: true,
    },
    {
      title: "Kako deluje?",
      url: "/beta-coach-wise/how-it-works",
      icon: IconInfoCircle,
      exact: true,
    },
  ],
  vprasalniki: [
    {
      name: "Onboarding",
      url: "/beta-coach-wise/onboarding",
      icon: IconUserCheck,
      exact: true,
    },
    {
      name: "Check in",
      url: "/beta-coach-wise/check-in",
      icon: IconActivityHeartbeat,
      exact: true,
    },
    {
      name: "Habbits",
      url: "/beta-coach-wise/habbits",
      icon: IconRepeat,
      exact: true,
    },

  ],
  documents: [
    {
      name: "Programi",
      url: "/beta-coach-wise/programi",
      icon: IconClipboardList,
      exact: true,
    },
    {
      name: "Meal plani",
      url: "/beta-coach-wise/meal-plani",
      icon: IconChefHat,
      exact: true,
    },
    {
      name: "Suplementi",
      url: "/beta-coach-wise/suplementi",
      icon: IconPill,
      exact: true,
    },
  ],
}

function SidebarBrand() {
  const pathname = usePathname()

  return (
    <div className="relative flex w-full items-center">
      <div className="flex w-full items-center gap-2 overflow-hidden opacity-100 transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[transition=closing]:pointer-events-none group-data-[transition=closing]:translate-x-1 group-data-[transition=closing]:opacity-0 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:translate-x-1 group-data-[collapsible=icon]:opacity-0">
        <Link
          href={buildCoachWiseHref(pathname, "/")}
          aria-label="SetWise home page"
          className="flex min-w-0 flex-1 items-center gap-(--space-2) cursor-pointer overflow-hidden"
        >
          <img
            src="/setwise-logo.png"
            alt="SetWise logo"
            className="size-(--space-5) rounded-sm"
          />
          <span className="truncate text-sm font-semibold text-foreground font-sans">
            SetWise
          </span>
        </Link>
        <SidebarTrigger className="ml-auto cursor-pointer text-muted-foreground hover:bg-neutral-300/80 hover:text-foreground" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:translate-x-0 group-data-[collapsible=icon]:opacity-100">
        <div className="group/brand relative flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-neutral-300/80">
          <div className="flex size-7 items-center justify-center rounded-md transition-opacity duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/brand:opacity-0 group-hover/brand:pointer-events-none">
            <img
              src="/setwise-logo.png"
              alt=""
              className="size-(--space-5) rounded-sm"
            />
            <span className="sr-only">SetWise</span>
          </div>
          <SidebarTrigger className="pointer-events-none absolute inset-0 m-0 size-7 cursor-pointer rounded-md opacity-0 transition-opacity duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/brand:pointer-events-auto group-hover/brand:opacity-100 hover:bg-neutral-300/80" />
        </div>
      </div>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-3 group-data-[collapsible=icon]:px-1">
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavVprasalniki items={data.vprasalniki} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
