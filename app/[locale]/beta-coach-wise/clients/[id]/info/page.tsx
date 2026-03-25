import type { ReactNode } from "react"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconChefHat,
  IconClipboardCheck,
  IconClipboardList,
  IconPill,
  IconPlus,
  IconRepeat,
  type Icon,
} from "@tabler/icons-react"
import { FileText, Mail, Tag, UserRound } from "lucide-react"

import {
  ClientAddNoteDialog,
  ClientNotesOverviewDialog,
  ClientUpdateNoteDialog,
} from "@/components/coachWise/clients/client-notes-overview-dialog"
import { CreateAssignedCheckinDialog } from "@/components/coachWise/clients/client-checkins-panel"
import { CreateNutritionPlanAction } from "@/components/coachWise/clients/client-nutrition-panel"
import { AddProgramDialog } from "@/components/coachWise/programs/exercise-history-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

type InfoCreateCardTone =
  | "programs"
  | "nutrition"
  | "supplements"
  | "checkins"
  | "habits"

const infoCreateCardClassName =
  "group relative flex min-h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white px-5 py-6 text-center shadow-none transition-colors hover:shadow-none"

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="bg-neutral-50">{children}</div>
}

function InfoActionSection({ children }: { children: ReactNode }) {
  return <section className="grid gap-3">{children}</section>
}

function InfoCreateCardContent({
  icon,
  sectionLabel,
  title,
  description,
  tone,
}: {
  icon: ReactNode
  sectionLabel: string
  title: string
  description: string
  tone: InfoCreateCardTone
}) {
  const toneStyles = {
    programs: {
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      watermark: "text-sky-500/12",
    },
    nutrition: {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      watermark: "text-emerald-500/12",
    },
    supplements: {
      badge: "border-violet-200 bg-violet-50 text-violet-700",
      watermark: "text-violet-500/12",
    },
    checkins: {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      watermark: "text-amber-500/12",
    },
    habits: {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      watermark: "text-rose-500/12",
    },
  }[tone]

  return (
    <>
      <span
        className={cn(
          "pointer-events-none absolute right-4 top-4 [&_svg]:size-16",
          toneStyles.watermark
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-2xl border transition-colors",
          toneStyles.badge
        )}
      >
        <IconPlus className="size-5" />
      </span>
      <span className="mb-1.5 text-[10px] font-medium tracking-[0.1em] text-neutral-400 uppercase">
        {sectionLabel}
      </span>
      <span className="text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">
        {title}
      </span>
      <span className="mt-2 max-w-[19rem] text-[13px] leading-5 text-neutral-500">
        {description}
      </span>
    </>
  )
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

function getSectionCardToneClassName(tone: InfoCreateCardTone) {
  switch (tone) {
    case "programs":
      return "border-sky-200/80 bg-linear-to-br from-sky-50/45 to-white hover:border-sky-300 hover:bg-sky-50/60"
    case "nutrition":
      return "border-emerald-200/80 bg-linear-to-br from-emerald-50/45 to-white hover:border-emerald-300 hover:bg-emerald-50/60"
    case "supplements":
      return "border-violet-200/80 bg-linear-to-br from-violet-50/45 to-white hover:border-violet-300 hover:bg-violet-50/60"
    case "checkins":
      return "border-amber-200/80 bg-linear-to-br from-amber-50/45 to-white hover:border-amber-300 hover:bg-amber-50/60"
    case "habits":
      return "border-rose-200/80 bg-linear-to-br from-rose-50/45 to-white hover:border-rose-300 hover:bg-rose-50/60"
  }
}

function buildCreateCardProps(tone: InfoCreateCardTone): {
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
      title: "Coach Notes",
      body: [
        "Client responds well to concrete weekly tasks and shorter check-in feedback loops.",
        "Keep food structure simple while training volume is increasing.",
      ],
      date: "18 March 2026",
      private: false,
    },
    {
      title: "Goal",
      body: [goalSummary],
      date: "16 November 2022",
      private: true,
    },
    {
      title: "Injuries",
      body: [injurySummary],
      date: "16 November 2022",
      private: true,
    },
  ]

  return (
    <SectionBody>
      <div className="grid gap-0 xl:grid-cols-[1.05fr_minmax(0,1.6fr)]">
        <div className="xl:h-[calc(100dvh-5.5rem)]">
          <Card className="flex h-full flex-col overflow-hidden gap-0! rounded-none border-t-0 border-l-0 border-neutral-200 bg-neutral-50 shadow-none">
            <CardHeader className="border-b border-neutral-200 px-3.5 py-2 ">
              <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                <IconClipboardList className="size-3.5 text-neutral-500" />
                <span>Client Details</span>
              </div>
            </CardHeader>
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

              <div className="flex min-h-0 flex-1 flex-col border-t border-neutral-200">
                <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                    <FileText className="size-3.5 text-neutral-500" />
                    <span>Notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClientNotesOverviewDialog notes={generalNotes} />
                    <ClientAddNoteDialog />
                  </div>
                </div>

                <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pr-2.5 [scrollbar-color:rgba(212,212,216,0.65)_transparent] [scrollbar-width:thin]">
                  {generalNotes.map((note) => (
                    <div
                      key={note.title}
                      className="group/note rounded-xl border border-neutral-200 bg-white"
                    >
                      <div className="flex items-start justify-between gap-3 px-3.5 pt-3.5">
                        <h3 className="text-[15px] font-semibold text-neutral-950">
                          {note.title}
                        </h3>
                        <ClientUpdateNoteDialog
                          note={note}
                          triggerLabel={`Edit ${note.title}`}
                          showTriggerOnHover
                        />
                      </div>
                      <div className="space-y-1.5 px-3.5 pb-3.5 pt-2 text-[13.5px] leading-6 text-neutral-700">
                        {note.body.length > 1 ? (
                          note.body.map((line) => (
                            <p key={line} className="pl-4 -indent-4">
                              - {line}
                            </p>
                          ))
                        ) : (
                          <p>{note.body[0]}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between rounded-b-xl border-t border-neutral-200 px-3.5 py-2.5 text-[12.5px] text-neutral-500">
                        <span>{note.date}</span>
                        {note.private ? (
                          <Badge className="rounded-md border border-neutral-300 bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase shadow-none hover:bg-neutral-800">
                            Private
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-5 p-4 md:grid-cols-2 xl:h-[calc(100dvh-5.5rem)] xl:overflow-y-auto [scrollbar-width:thin]">
          <InfoActionSection>
            <AddProgramDialog
              trigger={
                <button
                  type="button"
                  className={cn(
                    infoCreateCardClassName,
                    getSectionCardToneClassName("programs")
                  )}
                >
                  <InfoCreateCardContent
                    {...buildCreateCardProps("programs")}
                    icon={<IconClipboardList className="size-4" />}
                    tone="programs"
                  />
                </button>
              }
            />
          </InfoActionSection>

          <InfoActionSection>
            <CreateNutritionPlanAction
              phase={client.phase}
              trigger={
                <button
                  type="button"
                  className={cn(
                    infoCreateCardClassName,
                    getSectionCardToneClassName("nutrition")
                  )}
                >
                  <InfoCreateCardContent
                    {...buildCreateCardProps("nutrition")}
                    icon={<IconChefHat className="size-4" />}
                    tone="nutrition"
                  />
                </button>
              }
            />
          </InfoActionSection>

          <InfoActionSection>
            <Link
              href={`${clientBasePath}/supplements`}
              className={cn(
                infoCreateCardClassName,
                getSectionCardToneClassName("supplements")
              )}
            >
              <InfoCreateCardContent
                {...buildCreateCardProps("supplements")}
                icon={<IconPill className="size-4" />}
                tone="supplements"
              />
            </Link>
          </InfoActionSection>

          <InfoActionSection>
            <CreateAssignedCheckinDialog
              trigger={
                <button
                  type="button"
                  className={cn(
                    infoCreateCardClassName,
                    getSectionCardToneClassName("checkins")
                  )}
                >
                  <InfoCreateCardContent
                    {...buildCreateCardProps("checkins")}
                    icon={<IconClipboardCheck className="size-4" />}
                    tone="checkins"
                  />
                </button>
              }
            />
          </InfoActionSection>

          <InfoActionSection>
            <Link
              href={`${clientBasePath}/habbits`}
              className={cn(
                infoCreateCardClassName,
                getSectionCardToneClassName("habits")
              )}
            >
              <InfoCreateCardContent
                {...buildCreateCardProps("habits")}
                icon={<IconRepeat className="size-4" />}
                tone="habits"
              />
            </Link>
          </InfoActionSection>
        </div>
      </div>
    </SectionBody>
  )
}
