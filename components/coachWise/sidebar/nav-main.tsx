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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    exact?: boolean
  }[]
}) {
  const pathname = usePathname()
  const normalizedPathname = normalizeCoachWisePathname(pathname)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isPathActive(normalizedPathname, item.url, { exact: item.exact })}
                tooltip={item.title}
              >
                <Link href={buildCoachWiseHref(pathname, item.url)}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
