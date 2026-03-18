"use client"

import { type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { isPathActive } from "@/i18n/navigation"
import {
  buildCoachWiseHref,
  normalizeCoachWisePathname,
} from "@/components/coachWise/sidebar/route-utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
    exact?: boolean
  }[]
}) {
  const pathname = usePathname()
  const normalizedPathname = normalizeCoachWisePathname(pathname)

  return (
    <SidebarGroup className="transition-[padding] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
      <SidebarGroupLabel className="group-data-[transition=closing]:mt-0 group-data-[transition=closing]:max-h-8 group-data-[transition=closing]:-translate-x-1 group-data-[transition=closing]:px-2 group-data-[transition=closing]:opacity-0 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:max-h-8 group-data-[collapsible=icon]:-translate-x-1 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:opacity-0">
        Orodja
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isPathActive(normalizedPathname, item.url, { exact: item.exact })}
                tooltip={item.name}
              >
                <Link href={buildCoachWiseHref(pathname, item.url)}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
