import type { ReactNode } from "react"
import {
  IconCalendarEvent,
  IconChefHat,
  IconClipboardCheck,
  IconClipboardList,
  IconPill,
  IconPlus,
  IconRepeat,
} from "@tabler/icons-react"
import { FileText, Mail, Tag, UserRound } from "lucide-react"

import { CreateAssignedCheckinDialog } from "@/components/coachWise/clients/checkins/client-checkins-panel"
import { ClientNotesSection } from "@/components/coachWise/clients/info/client-notes-section"
import {
  ClientQuickActionCard,
  type ClientQuickActionTone,
} from "@/components/coachWise/clients/info/client-quick-action-card"
import { ClientSectionHeader } from "@/components/coachWise/clients/info/client-section-header"
import { CreateNutritionPlanAction } from "@/components/coachWise/clients/nutrition/client-nutrition-panel"
import { AddProgramDialog } from "@/components/coachWise/programs/exercise-history-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  type CoachWiseClientProfile,
  getClientCoachingWeek,
  getClientContactEmail,
  getClientGoalSummary,
  getClientInjurySummary,
  getClientTag,
} from "@/lib/handlers/clients.handlers"
import {
  resolveClientDetailContext,
  type ClientDetailParamsProps,
} from "@/lib/handlers/client-detail.handlers"
import { cn } from "@/lib/utils"

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="bg-neutral-50">{children}</div>
}

function InfoActionSection({ children }: { children: ReactNode }) {
  return <section className="grid gap-3">{children}</section>
}

function getPhaseBadgeClassName(phase?: string) {
  switch (phase) {
    case "Bulk":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
    case "Cut":
      return "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50"
    default:
      return "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50"
  }
}

function buildCreateCardProps(tone: ClientQuickActionTone): {
  sectionLabel: string
  title: string
  description: string
} {
  switch (tone) {
    case "programs":
      return {
        sectionLabel: "Programi",
        title: "Create Program",
        description: "Zgradi program od zacetka ali uporabi library template.",
      }
    case "nutrition":
      return {
        sectionLabel: "Nutrition",
        title: "Create Meal Plan",
        description: "Zgradi jedilnik od zacetka ali uporabi template.",
      }
    case "supplements":
      return {
        sectionLabel: "Suplementi",
        title: "Create Supplement Stack",
        description: "Odpri suplemente in nastavi stack ter dnevni schedule.",
      }
    case "checkins":
      return {
        sectionLabel: "Check-ins",
        title: "Create Check-in",
        description: "Dodaj nov check-in in pripravi naslednji feedback loop za stranko.",
      }
    case "habits":
      return {
        sectionLabel: "Habbits",
        title: "Create Habit",
        description: "Odpri habits in dodaj novo navado ali coaching cilj.",
      }
  }
}

export default async function Page({ params }: ClientDetailParamsProps) {
  const { client, clientId, clientBasePath } = await resolveClientDetailContext(
    params
  )
  const contactEmail = getClientContactEmail(client.header)
  const coachingWeek = getClientCoachingWeek(clientId)
  const clientTag = getClientTag(client.phase)
  const goalSummary = getClientGoalSummary(client.phase)
  const injurySummary = getClientInjurySummary(client.phase)
  const clientDetailRows = [
    {
      icon: <UserRound className="size-4" />,
      label: "Name",
      value: client.header,
    },
    {
      icon: <Mail className="size-4" />,
      label: "Email",
      value: contactEmail,
    },
    {
      icon: <IconClipboardCheck className="size-4" />,
      label: "Last Check-In",
      value: client.status === "Done" ? "1 day ago" : "3 hours ago",
    },
    {
      icon: <IconCalendarEvent className="size-4" />,
      label: "Duration",
      value: (
        <Badge className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[12px] font-medium text-blue-700 shadow-none hover:bg-blue-50">
          {coachingWeek}
        </Badge>
      ),
    },
    {
      icon: <IconClipboardList className="size-4" />,
      label: "Faza",
      value: (
        <Badge
          className={cn(
            "rounded-md px-2 py-0.5 text-[12px] font-medium shadow-none",
            getPhaseBadgeClassName(client.phase)
          )}
        >
          {client.phase}
        </Badge>
      ),
    },
    {
      icon: <Tag className="size-4" />,
      label: "Tags",
      value: (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-md border-neutral-200 text-neutral-500 shadow-none"
          >
            <IconPlus className="size-3.5" />
          </Button>
          <Badge className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[12px] font-medium text-red-700 shadow-none hover:bg-red-50">
            {clientTag}
          </Badge>
        </div>
      ),
    },
    {
      icon: <FileText className="size-4" />,
      label: "Questionnaires",
      value: (
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-md border-neutral-200 text-neutral-500 shadow-none"
        >
          <IconPlus className="size-3.5" />
        </Button>
      ),
    },
  ]
  const generalNotes = [
    {
      id: "coach-notes",
      title: "Coach Notes",
      body: [
        "Client responds well to concrete weekly tasks and shorter check-in feedback loops.",
        "Keep food structure simple while training volume is increasing.",
      ],
      date: "18 March 2026",
      private: false,
    },
    {
      id: "goal",
      title: "Goal",
      body: [goalSummary],
      date: "16 November 2022",
      private: true,
    },
    {
      id: "injuries",
      title: "Injuries",
      body: [injurySummary],
      date: "16 November 2022",
      private: true,
    },
  ]

  return (
    <SectionBody>
      <div className="grid gap-0 xl:grid-cols-[1.05fr_minmax(0,1.6fr)]">
        <div className="xl:h-[calc(100dvh-5.5rem)] ">
          <Card className="flex h-full flex-col overflow-hidden gap-0! rounded-none border-t-0 border-l-0 border-neutral-200 bg-neutral-50 shadow-none p-0">
            <ClientSectionHeader
              icon={<IconClipboardList />}
              title="Client Details"
            />
            <CardContent className="flex min-h-0 flex-1 pt-0! pb-0! flex-col p-0!">
              <div className="space-y-0.5 px-3.5 py-2">
                {clientDetailRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[16px_96px_minmax(0,1fr)] items-center gap-x-2 py-1.5"
                  >
                    <span className="text-neutral-500 [&_svg]:size-3.5">
                      {row.icon}
                    </span>
                    <div className="text-[13px] font-medium text-neutral-700">
                      {row.label}
                    </div>
                    <div className="min-w-0 text-[13.5px] leading-5 font-medium text-neutral-950 break-words">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              <ClientNotesSection initialNotes={generalNotes} />
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-5 p-4 md:grid-cols-2 xl:h-[calc(100dvh-5.5rem)] xl:overflow-y-auto [scrollbar-width:thin]">
          <InfoActionSection>
            <AddProgramDialog
              trigger={
                <ClientQuickActionCard
                  {...buildCreateCardProps("programs")}
                  icon={<IconClipboardList className="size-4" />}
                  tone="programs"
                />
              }
            />
          </InfoActionSection>

          <InfoActionSection>
            <CreateNutritionPlanAction
              phase={client.phase}
              trigger={
                <ClientQuickActionCard
                  {...buildCreateCardProps("nutrition")}
                  icon={<IconChefHat className="size-4" />}
                  tone="nutrition"
                />
              }
            />
          </InfoActionSection>

          <InfoActionSection>
            <ClientQuickActionCard
              {...buildCreateCardProps("supplements")}
              icon={<IconPill className="size-4" />}
              tone="supplements"
              href={`${clientBasePath}/supplements`}
            />
          </InfoActionSection>

          <InfoActionSection>
            <CreateAssignedCheckinDialog
              trigger={
                <ClientQuickActionCard
                  {...buildCreateCardProps("checkins")}
                  icon={<IconClipboardCheck className="size-4" />}
                  tone="checkins"
                />
              }
            />
          </InfoActionSection>

          <InfoActionSection>
            <ClientQuickActionCard
              {...buildCreateCardProps("habits")}
              icon={<IconRepeat className="size-4" />}
              tone="habits"
              href={`${clientBasePath}/habbits`}
            />
          </InfoActionSection>
        </div>
      </div>
    </SectionBody>
  )
}
