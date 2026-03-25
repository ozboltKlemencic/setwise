import type { ReactNode } from "react"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconChartBar,
  IconChefHat,
  IconClipboardCheck,
  IconClipboardList,
  IconPencil,
  IconPill,
  IconPlus,
  IconRepeat,
} from "@tabler/icons-react"
import {
  FileText,
  Mail,
  Tag,
  UserRound,
  MessageSquareText,
} from "lucide-react"
import { notFound } from "next/navigation"

import {
  AssignedCheckinDetailView,
  AssignedCheckinsPanel,
  CreateAssignedCheckinDialog,
  SubmittedCheckinPhotosCompareDialog,
  SubmittedCheckinsCompareDialog,
  SubmittedCheckinsPanel,
} from "@/components/coachWise/clients/client-checkins-panel"
import {
  ClientHabitsPanel,
} from "@/components/coachWise/clients/client-habits-panel"
import { ClientEditDialog } from "@/components/coachWise/clients/client-edit-dialog"
import {
  getClientProfileBasePath,
  TabsNav,
  type ClientProfileSection,
} from "@/components/coachWise/clients/tabs-nav"
import {
  SubtabsNavActionButton,
  SubtabsNav,
  subtabsNavActionButtonClassNames,
} from "@/components/coachWise/clients/subtabs-nav"
import {
  ClientAddNoteDialog,
  ClientNotesOverviewDialog,
  ClientUpdateNoteDialog,
} from "@/components/coachWise/clients/client-notes-overview-dialog"
import { SupplementsScheduleCalendar } from "@/components/coachWise/clients/supplements-schedule-calendar"
import {
  ClientNutritionPanel,
  CreateNutritionPlanAction,
  MealPlanDetailView,
} from "@/components/coachWise/clients/client-nutrition-panel"
import {
  AddProgramDialog,
  CompletedWorkoutsPanel,
  ExerciseHistoryPanel,
  FixedProgramsTable,
  ProgramsOverviewActions,
  ProgramsPeriodPicker,
  WorkoutDetailView,
} from "@/components/coachWise/programs/exercise-history-panel"
import { WorkoutCalendar } from "@/components/coachWise/programs/workout-calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import data from "../../data.json"

type ClientProfileSearchParams = {
  checkinTab?: string | string[]
  assignedCheckin?: string | string[]
  habitTab?: string | string[]
  habitId?: string | string[]
  nutritionTab?: string | string[]
  mealPlanId?: string | string[]
  programTab?: string | string[]
  programType?: string | string[]
  workoutId?: string | string[]
}

export type ClientProfileRouteProps = {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<ClientProfileSearchParams>
}

type Props = ClientProfileRouteProps & {
  section: ClientProfileSection
}

const infoCreateCardClassName =
  "group relative flex min-h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white px-5 py-6 text-center shadow-none transition-colors hover:shadow-none"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function getPhaseFocus(phase?: string) {
  switch (phase) {
    case "Bulk":
      return "Fokus je na progresivnem overloadu, visji energiji in rednem spremljanju regeneracije."
    case "Cut":
      return "Fokus je na doslednosti, kontroli vnosa in ohranjanju performansa med deficitom."
    default:
      return "Fokus je na stabilni rutini, kvalitetnem recoveryju in dolgorochnem napredku."
  }
}

function getNutritionFocus(phase?: string) {
  switch (phase) {
    case "Bulk":
      return {
        calories: "2850 kcal",
        macros: "190P / 330C / 75F",
        note: "Rahlo povisan vnos za podporo treningu in napredku v moci.",
      }
    case "Cut":
      return {
        calories: "2150 kcal",
        macros: "185P / 190C / 65F",
        note: "Deficit je nastavljen tako, da ostane energija za trening in check-in ritem.",
      }
    default:
      return {
        calories: "2450 kcal",
        macros: "180P / 250C / 70F",
        note: "Vzdrzevalni vnos za stabilno formo, dober recovery in enakomeren tempo.",
      }
  }
}

function getWhatsappLink(name: string) {
  const message = `Pozdrav ${name}, javljam se glede tvojega check-ina.`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 bg-neutral-50">{children}</div>
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
  tone:
    | "programs"
    | "nutrition"
    | "supplements"
    | "checkins"
    | "habits"
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

function SupplementsSectionTable({
  title,
  rows,
}: {
  title: string
  rows: {
    supplement: string
    timing: string
    dose: string
    purpose: string
  }[]
}) {
  return (
    <div className="space-y-2">
      <div className="px-1 text-[12px] font-medium text-neutral-500">{title}</div>
      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 lg:pl-5">Supplement</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Dose</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${title}-${row.supplement}`}>
                <TableCell className="pl-4 font-medium text-neutral-950 lg:pl-5">
                  {row.supplement}
                </TableCell>
                <TableCell>{row.timing}</TableCell>
                <TableCell>{row.dose}</TableCell>
                <TableCell className="text-neutral-600">{row.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default async function ClientProfilePage({
  params,
  searchParams,
  section,
}: Props) {
  const { id, locale } = await params
  const resolvedSearchParams = await searchParams
  const clientId = Number(id)
  const activeCheckinTab = Array.isArray(resolvedSearchParams.checkinTab)
    ? resolvedSearchParams.checkinTab[0]
    : resolvedSearchParams.checkinTab
  const assignedCheckinId = Array.isArray(resolvedSearchParams.assignedCheckin)
    ? resolvedSearchParams.assignedCheckin[0]
    : resolvedSearchParams.assignedCheckin
  const activeHabitTab = Array.isArray(resolvedSearchParams.habitTab)
    ? resolvedSearchParams.habitTab[0]
    : resolvedSearchParams.habitTab
  const activeNutritionTab = Array.isArray(resolvedSearchParams.nutritionTab)
    ? resolvedSearchParams.nutritionTab[0]
    : resolvedSearchParams.nutritionTab
  const mealPlanId = Array.isArray(resolvedSearchParams.mealPlanId)
    ? resolvedSearchParams.mealPlanId[0]
    : resolvedSearchParams.mealPlanId
  const activeProgramTab = Array.isArray(resolvedSearchParams.programTab)
    ? resolvedSearchParams.programTab[0]
    : resolvedSearchParams.programTab
  const activeProgramType = Array.isArray(resolvedSearchParams.programType)
    ? resolvedSearchParams.programType[0]
    : resolvedSearchParams.programType
  const workoutId = Array.isArray(resolvedSearchParams.workoutId)
    ? resolvedSearchParams.workoutId[0]
    : resolvedSearchParams.workoutId

  if (!Number.isInteger(clientId)) {
    notFound()
  }

  const client = data.find((item) => item.id === clientId)
  const resolvedCheckinTab =
    activeCheckinTab === "assigned" ? "assigned" : "submitted"
  const resolvedHabitTab =
    activeHabitTab === "overview" ? "overview" : "habits"
  const resolvedNutritionTab =
    activeNutritionTab === "nutrition-logger"
      ? "nutrition-logger"
      : "meal-plans"
  const resolvedProgramTab =
    activeProgramTab === "exercise-history" ||
      activeProgramTab === "completed-workouts"
      ? activeProgramTab
      : "calendar"
  const resolvedProgramType = activeProgramType === "fixed" ? "fixed" : "calendar"

  if (!client) {
    notFound()
  }

  const clientBasePath = getClientProfileBasePath(locale, clientId)

  if (assignedCheckinId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <AssignedCheckinDetailView checkinId={assignedCheckinId} />
      </section>
    )
  }

  if (mealPlanId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <MealPlanDetailView mealPlanId={mealPlanId} phase={client.phase} />
      </section>
    )
  }

  if (workoutId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <WorkoutDetailView workoutId={workoutId} />
      </section>
    )
  }

  const nutrition = getNutritionFocus(client.phase)
  const habits = [
    {
      title: "Spanje",
      value: client.status === "Done" ? "7h 45m" : "7h 10m",
      description: "Stabilen vecerni ritem in dober recovery po treningu.",
    },
    {
      title: "Hidracija",
      value: "2.6L / dan",
      description: "Vnos vode je enakomeren, prostor je se za malo vec ob treningih.",
    },
    {
      title: "Koraki",
      value: client.phase === "Cut" ? "10.2k / dan" : "8.4k / dan",
      description: "Dnevno gibanje podpira trenutno fazo in splosno kondicijo.",
    },
  ]
  const supplementSections = [
    {
      title: "Performance",
      rows: [
        {
          supplement: "Kreatin",
          timing: "Vsak dan z zajtrkom",
          dose: "5 g",
          purpose: "Podpora performansu in ponovljivosti v treningu.",
        },
        {
          supplement: "Elektroliti",
          timing: "Pred treningom",
          dose: "1 serving",
          purpose: "Boljssa hidracija in stabilna energija med sessionom.",
        },
      ],
    },
    {
      title: "Health",
      rows: [
        {
          supplement: "Omega 3",
          timing: "Kosilo",
          dose: "2 kapsuli",
          purpose: "Podpora splosnemu zdravju in regeneraciji.",
        },
        {
          supplement: "Vitamin D3",
          timing: "Zjutraj",
          dose: "2000 IU",
          purpose: "Podpora imunskemu sistemu in splosnemu well-beingu.",
        },
      ],
    },
    {
      title: "Recovery",
      rows: [
        {
          supplement: "Magnezij",
          timing: "Pred spanjem",
          dose: "300 mg",
          purpose: "Podpora vecernemu ritualu in boljssemu recoveryju.",
        },
        {
          supplement: "Glicin",
          timing: "Pred spanjem",
          dose: "3 g",
          purpose: "Pomoc pri umiritvi rutine in kvaliteti spanja.",
        },
      ],
    },
  ]
  const contactEmail = `${client.header.toLowerCase().replaceAll(" ", ".")}@hubfit.io`
  const [clientFirstName, ...clientLastNameParts] = client.header.split(" ")
  const clientLastName = clientLastNameParts.join(" ")
  const contactPhone = `+386 40 ${String(120 + clientId).padStart(3, "0")} ${String(310 + clientId).padStart(3, "0")}`
  const coachingWeek = `Week ${((clientId + 10) % 13) + 1} of 13`
  const clientTag =
    client.phase === "Bulk"
      ? "Strength Focus"
      : client.phase === "Cut"
        ? "Fat Loss"
        : "In-Person"
  const goalSummary =
    client.phase === "Bulk"
      ? "Wants to improve strength numbers, stay consistent with food quality and keep recovery high through the week."
      : client.phase === "Cut"
        ? "Wants to go down from 95kg to 75kg while keeping training performance stable and energy predictable."
        : "Wants to maintain body composition, keep routine stable and improve overall daily energy."
  const injurySummary =
    client.phase === "Bulk"
      ? "Sensitive left shoulder after heavier pressing days, but no pain in daily movement. Extra warm-up remains important."
      : "Occasional lower-back tightness after longer sitting blocks. Mobility before training keeps symptoms under control."
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
      icon: <IconChartBar className="size-4" />,
      label: "Faza",
      value: (
        <Badge
          className={cn(
            "rounded-md px-2 py-0.5 text-[12px] font-medium shadow-none",
            client.phase === "Bulk"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
              : client.phase === "Cut"
                ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50"
                : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50"
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
    <section className="min-w-0 bg-neutral-50">
      <Tabs value={section} className="min-w-0 w-full gap-0">
        <TabsNav
          locale={locale}
          clientId={clientId}
          activeSection={section}
          actions={
            <Button
              asChild
              variant="outline"
              size="icon-sm"
              className="rounded-sm border-neutral-200 bg-white px-2.5 py-2 text-neutral-600 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
            >
              <a
                href={getWhatsappLink(client.header)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Odpri WhatsApp za ${client.header}`}
              >
                <MessageSquareText className="size-4" />
              </a>
            </Button>
          }
        />

        <TabsContent value="info" className="mt-0 space-y-0">
          <SectionBody>
            <div className="grid gap-4 p-4 xl:grid-cols-[1.05fr_minmax(0,1.6fr)]">
                  <div className="xl:h-[calc(100vh-11.5rem)] xl:pr-1">
                    <Card className="flex h-full flex-col overflow-hidden gap-0! border-neutral-200 bg-white shadow-none">
                      <CardHeader className="border-b border-neutral-200 px-3.5 py-2 ">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                            <IconClipboardList className="size-3.5 text-neutral-500" />
                            <span>Client Details</span>
                          </div>
                          <ClientEditDialog
                            firstName={clientFirstName}
                            lastName={clientLastName}
                            email={contactEmail}
                            phone={contactPhone}
                            status={client.type}
                            phase={client.phase}
                            trigger={
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-8 rounded-md border-neutral-200 bg-white text-neutral-600 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
                                aria-label="Edit client"
                              >
                                <IconPencil className="size-4" />
                              </Button>
                            }
                          />
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

                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pr-2.5 [scrollbar-width:thin]">
                            {generalNotes.map((note) => (
                              <div
                                key={note.title}
                                className="rounded-xl border border-neutral-200 bg-white"
                              >
                                <div className="flex items-start justify-between gap-3 px-3.5 pt-3.5">
                                  <h3 className="text-[15px] font-semibold text-neutral-950">
                                    {note.title}
                                  </h3>
                                  <ClientUpdateNoteDialog note={note} />
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

                  <div className="grid content-start gap-5 md:grid-cols-2 xl:h-[calc(100vh-11.5rem)] xl:overflow-y-auto xl:pr-1 [scrollbar-width:thin]">
                    <InfoActionSection>
                      <AddProgramDialog
                        trigger={
                          <button
                            type="button"
                            className={cn(
                              infoCreateCardClassName,
                              "border-sky-200/80 bg-linear-to-br from-sky-50/45 to-white hover:border-sky-300 hover:bg-sky-50/60"
                            )}
                          >
                            <InfoCreateCardContent
                              icon={<IconClipboardList className="size-4" />}
                              sectionLabel="Programi"
                              title="Create Program"
                              description="Zgradi program od začetka ali uporabi library template."
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
                              "border-emerald-200/80 bg-linear-to-br from-emerald-50/45 to-white hover:border-emerald-300 hover:bg-emerald-50/60"
                            )}
                          >
                            <InfoCreateCardContent
                              icon={<IconChefHat className="size-4" />}
                              sectionLabel="Nutrition"
                              title="Create Meal Plan"
                              description="Zgradi jedilnik od začetka ali uporabi template."
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
                          "border-violet-200/80 bg-linear-to-br from-violet-50/45 to-white hover:border-violet-300 hover:bg-violet-50/60"
                        )}
                      >
                        <InfoCreateCardContent
                          icon={<IconPill className="size-4" />}
                          sectionLabel="Suplementi"
                          title="Create Supplement Stack"
                          description="Odpri suplemente in nastavi stack ter dnevni schedule."
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
                              "border-amber-200/80 bg-linear-to-br from-amber-50/45 to-white hover:border-amber-300 hover:bg-amber-50/60"
                            )}
                          >
                            <InfoCreateCardContent
                              icon={<IconClipboardCheck className="size-4" />}
                              sectionLabel="Check-ins"
                              title="Create Check-in"
                              description="Dodaj nov check-in in pripravi naslednji feedback loop za stranko."
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
                          "border-rose-200/80 bg-linear-to-br from-rose-50/45 to-white hover:border-rose-300 hover:bg-rose-50/60"
                        )}
                      >
                        <InfoCreateCardContent
                          icon={<IconRepeat className="size-4" />}
                          sectionLabel="Habbits"
                          title="Create Habit"
                          description="Odpri habits in dodaj novo navado ali coaching cilj."
                          tone="habits"
                        />
                      </Link>
                    </InfoActionSection>
                  </div>
                </div>
          </SectionBody>
        </TabsContent>

        <TabsContent value="habbits" className="mt-0 space-y-0">
          <ClientHabitsPanel initialSubTab={resolvedHabitTab} />
          {false ? (
            <Tabs defaultValue="daily-habits" className="gap-0">
              <SubtabsNav
                items={[
                  {
                    icon: <IconRepeat className="size-4" />,
                    label: "Daily habits",
                    value: "daily-habits",
                  },
                  {
                    icon: <IconChartBar className="size-4" />,
                    label: "Streaks",
                    value: "streaks",
                  },
                  {
                    icon: <IconClipboardCheck className="size-4" />,
                    label: "Weekly score",
                    value: "weekly-score",
                  },
                ]}
                actions={
                  <Button
                    size="sm"
                    className={subtabsNavActionButtonClassNames.primary}
                  >
                    <IconPlus className="size-4" />
                    Add habit
                  </Button>
                }
              />

              <TabsContent value="daily-habits" className="mt-0 space-y-0">
                <SectionBody>
                  <div className="grid gap-4 md:grid-cols-3">
                    {habits.map((habit) => (
                      <Card key={habit.title}>
                        <CardHeader>
                          <CardDescription>{habit.title}</CardDescription>
                          <CardTitle>{habit.value}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          {habit.description}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rutina tedna</CardTitle>
                      <CardDescription>
                        Kratek pregled navad, ki jih je smiselno spremljati vsak
                        teden.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                        Jutranji check: voda, kratka mobilnost, 10 minut hoje.
                      </div>
                      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                        Vecerni check: spanje, magnezij, priprava obrokov za naslednji
                        dan.
                      </div>
                    </CardContent>
                  </Card>
                </SectionBody>
              </TabsContent>

              <TabsContent value="streaks" className="mt-0 space-y-0">
                <SectionBody>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardDescription>Sleep streak</CardDescription>
                        <CardTitle>12 dni</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Več kot 7 ur spanja v zadnjih dveh tednih.
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardDescription>Hydration streak</CardDescription>
                        <CardTitle>9 dni</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Dnevni cilj tekočine je dosežen skoraj vsak dan.
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardDescription>Steps streak</CardDescription>
                        <CardTitle>6 dni</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Gibanje je najboljše na trening dneve, vikendi še nihajo.
                      </CardContent>
                    </Card>
                  </div>
                </SectionBody>
              </TabsContent>

              <TabsContent value="weekly-score" className="mt-0 space-y-0">
                <SectionBody>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardDescription>Overall score</CardDescription>
                        <CardTitle>8.4 / 10</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardDescription>Consistency</CardDescription>
                        <CardTitle>84%</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardDescription>Next focus</CardDescription>
                        <CardTitle>Weekend rhythm</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tedenski povzetek</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Navade so dobre med delovnikom. Največ rezerve je v sobotnem in
                      nedeljskem ritmu prehrane, spanja in korakov.
                    </CardContent>
                  </Card>
                </SectionBody>
              </TabsContent>
            </Tabs>
          ) : null}
        </TabsContent>

        <TabsContent value="checkins" className="mt-0 space-y-0">
          <Tabs
            value={resolvedCheckinTab}
            className="gap-0"
          >
            <SubtabsNav
              items={[
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Oddani",
                  value: "submitted",
                  href: "?checkinTab=submitted",
                },
                {
                  icon: <IconCalendarEvent className="size-4" />,
                  label: "Dodeljeni",
                  value: "assigned",
                  href: "?checkinTab=assigned",
                },
              ]}
              actions={
                resolvedCheckinTab === "assigned" ? (
                  <CreateAssignedCheckinDialog
                    trigger={
                      <SubtabsNavActionButton
                        variant="primary"
                        icon={<IconPlus className="size-4" />}
                        label="Nov check-in"
                      />
                    }
                  />
                ) : (
                  <>
                    <SubmittedCheckinPhotosCompareDialog
                      triggerIcon="photo"
                      triggerLabel="Primerjaj slike"
                      trigger={
                        <SubtabsNavActionButton
                          variant="secondary"
                          icon={<IconClipboardCheck className="size-4" />}
                          label="Primerjaj slike"
                        />
                      }
                    />
                    <SubmittedCheckinsCompareDialog
                      trigger={
                        <SubtabsNavActionButton
                          variant="secondary"
                          icon={<IconChartBar className="size-4" />}
                          label="Compare"
                        />
                      }
                    />
                  </>
                )
              }
            />

            <TabsContent value="submitted" className="mt-0 space-y-0">
              <SectionBody>
                <SubmittedCheckinsPanel clientName={client.header} />
              </SectionBody>
            </TabsContent>

            <TabsContent value="assigned" className="mt-0 space-y-0">
              <SectionBody>
                <AssignedCheckinsPanel />
                {false ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Check-in history</CardTitle>
                      <CardDescription>
                        Zadnji trije vnosi in ključni poudarki.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                        11 Mar: energija bolj stabilna, spanec izboljšan, trening dober.
                      </div>
                      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                        04 Mar: prehrana konsistentna, hidracija nekoliko pod planom.
                      </div>
                      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                        26 Feb: dober začetek cikla, potreben manjši popravek vikend rutine.
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </SectionBody>
            </TabsContent>

            <TabsContent value="pending" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Naslednji rok</CardDescription>
                      <CardTitle>Ponedeljek</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Open items</CardDescription>
                      <CardTitle>3</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Priority</CardDescription>
                      <CardTitle>Sleep + nutrition</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-0 space-y-0">
          <ClientNutritionPanel
            phase={client.phase}
            initialSubTab={resolvedNutritionTab}
          />
          {false ? <Tabs defaultValue="meal-plans" className="gap-0">
            <SubtabsNav
              items={[
                {
                  icon: <IconChefHat className="size-4" />,
                  label: "Meal Plans",
                  value: "meal-plans",
                },
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "Nutrition Logger",
                  value: "nutrition-logger",
                },
              ]}
              actions={
                <Button
                  size="sm"
                  className={subtabsNavActionButtonClassNames.primary}
                >
                  <IconPlus className="size-4" />
                  Add Meal Plan
                </Button>
              }
            />

            <TabsContent value="meal-plans" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Dnevni cilj</CardDescription>
                      <CardTitle>{nutrition.calories}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Nastavljeno glede na trenutno fazo in tempo napredka.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Makroji</CardDescription>
                      <CardTitle>{nutrition.macros}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Razmerje podpira trening, recovery in dober apetit.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Meal flow</CardDescription>
                      <CardTitle>4 obroki / dan</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      2 vecja obroka, 1 pre-workout in 1 vecerni recovery meal.
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition note</CardTitle>
                    <CardDescription>
                      Trenutni prehranski fokus za to fazo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {nutrition.note}
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>

            <TabsContent value="nutrition-logger" className="mt-0 space-y-0">
              <SectionBody>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardDescription>Logged days</CardDescription>
                      <CardTitle>11 / 14</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Protein target</CardDescription>
                      <CardTitle>92%</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Hydration</CardDescription>
                      <CardTitle>2.4L avg</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Logger note</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Logging je dovolj dober za coaching odločitve. Največ odstopanja
                    nastane pri vikend obrokih in večernih snackih.
                  </CardContent>
                </Card>
              </SectionBody>
            </TabsContent>
          </Tabs> : null}
        </TabsContent>

        <TabsContent value="supplements" className="mt-0 space-y-0">
          <Tabs defaultValue="stack" className="gap-0">
            <SubtabsNav
              items={[
                {
                  icon: <IconPill className="size-4" />,
                  label: "Stack",
                  value: "stack",
                },
                {
                  icon: <IconCalendarEvent className="size-4" />,
                  label: "Schedule",
                  value: "schedule",
                },
              ]}
            />

            <TabsContent value="stack" className="mt-0 space-y-0 m-2">
              <SectionBody>
                {supplementSections.map((section) => (
                  <SupplementsSectionTable
                    key={section.title}
                    title={section.title}
                    rows={section.rows}
                  />
                ))}
              </SectionBody>
            </TabsContent>

            <TabsContent value="schedule" className="mt-0 space-y-0 m-2">
              <SectionBody>
                <SupplementsScheduleCalendar />
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="programs" className="mt-0 space-y-0">
          <Tabs value={resolvedProgramTab} className="gap-0">
            <SubtabsNav
              items={[
                {
                  icon: <IconCalendarEvent className="size-4" />,
                  label: "Overview",
                  value: "calendar",
                  href: `${clientBasePath}/programs?programTab=calendar`,
                },
                {
                  icon: <IconChartBar className="size-4" />,
                  label: "Progress",
                  value: "exercise-history",
                  href: `${clientBasePath}/programs?programTab=exercise-history`,
                },
                {
                  icon: <IconClipboardCheck className="size-4" />,
                  label: "History",
                  value: "completed-workouts",
                  href: `${clientBasePath}/programs?programTab=completed-workouts`,
                },
              ]}
              actions={
                resolvedProgramTab === "calendar" ? (
                  <ProgramsOverviewActions programType={resolvedProgramType} />
                ) : resolvedProgramTab === "exercise-history" ||
                  resolvedProgramTab === "completed-workouts" ? (
                  <ProgramsPeriodPicker />
                ) : null
              }
            />

            <TabsContent value="calendar" className="mt-0 space-y-0">
              <SectionBody>
                {resolvedProgramType === "fixed" ? (
                  <FixedProgramsTable />
                ) : (
                  <WorkoutCalendar />
                )}
              </SectionBody>
            </TabsContent>

            <TabsContent value="exercise-history" className="mt-0 space-y-0">
              <SectionBody>
                <ExerciseHistoryPanel />
              </SectionBody>
            </TabsContent>

            <TabsContent value="completed-workouts" className="mt-0 space-y-0">
              <SectionBody>
                <CompletedWorkoutsPanel />
              </SectionBody>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </section>
  )
}
