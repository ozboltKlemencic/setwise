"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"

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
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Jernej Ficko",
    email: "jernej.123@gmmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Stranke",
      url: "#",
      icon: IconDashboard,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Programi",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Meal plani",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Suplementi",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

function SidebarBrand() {
  return (
    <div className="relative flex w-full items-center">
      <div className="flex w-full items-center gap-2 overflow-hidden opacity-100 transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[transition=closing]:pointer-events-none group-data-[transition=closing]:translate-x-1 group-data-[transition=closing]:opacity-0 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:translate-x-1 group-data-[collapsible=icon]:opacity-0">
        <Link
          href="/"
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
