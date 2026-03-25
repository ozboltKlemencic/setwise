import type { ReactNode } from "react"
import Link from "next/link"
import {
  IconChefHat,
  IconClipboardCheck,
  IconClipboardList,
  IconInfoCircle,
  IconPill,
  IconRepeat,
} from "@tabler/icons-react"

import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export type ClientProfileSection =
  | "info"
  | "habbits"
  | "checkins"
  | "nutrition"
  | "supplements"
  | "programs"

type ClientProfileTabDefinition = {
  label: string
  value: ClientProfileSection
  icon: ReactNode
}

type ClientProfileTabsNavProps = {
  locale: string
  clientId: number | string
  activeSection: ClientProfileSection
  actions?: ReactNode
  className?: string
}

const clientProfileTabDefinitions: readonly ClientProfileTabDefinition[] = [
  {
    label: "Info",
    value: "info",
    icon: <IconInfoCircle className="size-4" />,
  },
  {
    label: "Habbits",
    value: "habbits",
    icon: <IconRepeat className="size-4" />,
  },
  {
    label: "Check-ins",
    value: "checkins",
    icon: <IconClipboardCheck className="size-4" />,
  },
  {
    label: "Nutrition",
    value: "nutrition",
    icon: <IconChefHat className="size-4" />,
  },
  {
    label: "Supplements",
    value: "supplements",
    icon: <IconPill className="size-4" />,
  },
  {
    label: "Programs",
    value: "programs",
    icon: <IconClipboardList className="size-4" />,
  },
]

const profileTabLinkClassName =
  "inline-flex h-full flex-none items-center justify-center gap-1.5 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13px] font-normal whitespace-nowrap text-neutral-500 transition-colors hover:text-neutral-700 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-neutral-400"

const profileTabLinkActiveClassName =
  "border-(--brand-500) text-neutral-900 [&_svg]:text-(--brand-600)"

function getLocalePrefix(locale: string) {
  return locale === routing.defaultLocale ? "" : `/${locale}`
}

export function getClientProfileBasePath(locale: string, clientId: number | string) {
  return `${getLocalePrefix(locale)}/beta-coach-wise/clients/${clientId}`
}

export function getClientProfileSectionHref(
  locale: string,
  clientId: number | string,
  section: ClientProfileSection
) {
  return `${getClientProfileBasePath(locale, clientId)}/${section}`
}

export function ClientProfileTabsNav({
  locale,
  clientId,
  activeSection,
  actions,
  className,
}: ClientProfileTabsNavProps) {
  return (
    <div className={cn("border-b border-neutral-200 bg-neutral-50", className)}>
      <div className="flex min-w-0 items-center">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav aria-label="Client profile sections " className="flex min-w-max items-center">
            {clientProfileTabDefinitions.map((tab) => (
              <Link
                key={tab.value}
                href={getClientProfileSectionHref(locale, clientId, tab.value)}
                aria-current={activeSection === tab.value ? "page" : undefined}
                className={cn(
                  profileTabLinkClassName,
                  activeSection === tab.value && profileTabLinkActiveClassName
                )}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2 self-stretch pr-3">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
