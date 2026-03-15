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
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
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
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

function SidebarBrand() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isCollapsed) {
    return (
      <div className="group/brand relative mx-auto flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-neutral-300/80">
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
    )
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Link
        href="/"
        aria-label="SetWise home page"
        className="flex min-w-0 flex-1 items-center gap-(--space-2) cursor-pointer"
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
