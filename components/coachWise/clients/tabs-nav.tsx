"use client"

import type { MouseEventHandler, ReactNode } from "react"
import Link from "next/link"
import {
  IconChefHat,
  IconClipboardCheck,
  IconClipboardList,
  IconInfoCircle,
  IconPill,
  IconRepeat,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import {
  PrimaryActionButton,
} from "@/components/coachWise/primary-action-button"
import {
  SecondaryActionButton,
} from "@/components/coachWise/secondary-action-button"
import {
  getClientProfileSectionHref,
  type ClientProfileSection,
} from "@/components/coachWise/clients/client-profile-routes"
import { normalizeCoachWisePathname } from "@/components/coachWise/sidebar/route-utils"
import { cn } from "@/lib/utils"

type ClientProfileTabDefinition = {
  label: string
  value: ClientProfileSection
  icon: ReactNode
}

export type TabsNavActionButtonProps = {
  label: string
  icon?: ReactNode
  variant?: "primary" | "secondary"
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

type TabsNavProps = {
  locale: string
  clientId: number | string
  activeSection?: ClientProfileSection
  actions?: ReactNode
  actionButtons?: TabsNavActionButtonProps[]
  className?: string
  actionsClassName?: string
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
  "inline-flex h-full flex-none cursor-pointer items-center justify-center gap-1.5 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13px] font-normal whitespace-nowrap text-neutral-500 transition-colors hover:text-neutral-700 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-neutral-400"

const profileTabLinkActiveClassName =
  "border-(--brand-500) text-neutral-900 [&_svg]:text-(--brand-600)"

const tabsNavActionButtonClassName =
  "gap-1 px-2.5 text-[13px] font-medium [&_svg]:size-3"

const clientProfileSections = clientProfileTabDefinitions.map(
  (tab) => tab.value
) as readonly ClientProfileSection[]

function renderActionButtonContent(label: string, icon?: ReactNode) {
  return (
    <>
      {icon ? <span className="flex items-center text-current">{icon}</span> : null}
      <span>{label}</span>
    </>
  )
}

function resolveActiveSectionFromPathname(pathname: string): ClientProfileSection {
  const normalizedPathname = normalizeCoachWisePathname(pathname)
  const match = normalizedPathname.match(
    /^\/beta-coach-wise\/clients\/[^/]+\/([^/?#]+)/
  )
  const matchedSection = match?.[1]

  if (
    matchedSection &&
    clientProfileSections.includes(matchedSection as ClientProfileSection)
  ) {
    return matchedSection as ClientProfileSection
  }

  return "info"
}

export function TabsNav({
  locale,
  clientId,
  activeSection,
  actions,
  actionButtons,
  className,
  actionsClassName,
}: TabsNavProps) {
  const pathname = usePathname()
  const resolvedActiveSection =
    activeSection ?? resolveActiveSectionFromPathname(pathname)
  const hasActions =
    Boolean(actions) || Boolean(actionButtons && actionButtons.length > 0)

  return (
    <div className={cn("border-b border-neutral-200 bg-neutral-50", className)}>
      <div className="flex min-w-0 items-center">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav aria-label="Client profile sections" className="flex min-w-max items-center">
            {clientProfileTabDefinitions.map((tab) => (
              <Link
                key={tab.value}
                href={getClientProfileSectionHref(locale, clientId, tab.value)}
                aria-current={resolvedActiveSection === tab.value ? "page" : undefined}
                className={cn(
                  profileTabLinkClassName,
                  resolvedActiveSection === tab.value &&
                    profileTabLinkActiveClassName
                )}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        {hasActions ? (
          <div
            className={cn(
              "flex shrink-0 items-center gap-2 self-stretch pr-3",
              actionsClassName
            )}
          >
            {actionButtons?.map((action) => {
              const content = renderActionButtonContent(action.label, action.icon)

              if (action.variant === "primary") {
                if (action.href) {
                  return (
                    <PrimaryActionButton
                      key={`${action.variant}-${action.label}`}
                      href={action.href}
                      label={content}
                      className={cn(tabsNavActionButtonClassName, action.className)}
                    />
                  )
                }

                return (
                  <PrimaryActionButton
                    key={`${action.variant}-${action.label}`}
                    type={action.type}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    label={content}
                    className={cn(tabsNavActionButtonClassName, action.className)}
                  />
                )
              }

              if (action.href) {
                return (
                  <SecondaryActionButton
                    key={`${action.variant ?? "secondary"}-${action.label}`}
                    href={action.href}
                    label={content}
                    className={cn(tabsNavActionButtonClassName, action.className)}
                  />
                )
              }

              return (
                <SecondaryActionButton
                  key={`${action.variant ?? "secondary"}-${action.label}`}
                  type={action.type}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  label={content}
                  className={cn(tabsNavActionButtonClassName, action.className)}
                />
              )
            })}
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
