"use client"

import * as React from "react"
import {
  IconDotsVertical,
  IconPencil,
  IconSend,
  IconTrash,
} from "@tabler/icons-react"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type SubmittedCheckin = {
  id: string
  title: string
  date: string
  status: "Pregledan" | "Caka na pregled" | "Nov"
  biggestWin: string
  workoutsCompleted: number
  reachedTarget: string
  progressScore: number
  bestDay: string
  satisfaction: number
  improvementArea: string
}

type AssignedCheckin = {
  id: string
  title: string
  schedule: string
  nextDue: string
  status: string
  questionCount: number
  description: string
  previewClassName: string
}

const submittedCheckins: SubmittedCheckin[] = [
  {
    id: "weekly-18-03",
    title: "Tedenski check-in",
    date: "18.03.2026",
    status: "Nov",
    biggestWin:
      "Uspel sem oddelati vseh 5 planiranih treningov in prvic brez vecjih odstopanj drzal tudi prehranski ritem cez cel teden.",
    workoutsCompleted: 5,
    reachedTarget: "Da",
    progressScore: 8,
    bestDay: "14.03.2026",
    satisfaction: 4,
    improvementArea: "Moc",
  },
  {
    id: "weekly-11-03",
    title: "Tedenski check-in",
    date: "11.03.2026",
    status: "Pregledan",
    biggestWin:
      "Spanec je bil precej bolj stabilen in opazil sem manj padcev energije v drugi polovici dneva.",
    workoutsCompleted: 4,
    reachedTarget: "Delno",
    progressScore: 7,
    bestDay: "09.03.2026",
    satisfaction: 4,
    improvementArea: "Recovery",
  },
  {
    id: "weekly-04-03",
    title: "Tedenski check-in",
    date: "04.03.2026",
    status: "Pregledan",
    biggestWin:
      "Najvecji premik je bil pri doslednosti obrokov in hidraciji, predvsem na dneve s treningom.",
    workoutsCompleted: 4,
    reachedTarget: "Da",
    progressScore: 7,
    bestDay: "02.03.2026",
    satisfaction: 3,
    improvementArea: "Prehrana",
  },
]

const assignedCheckins: AssignedCheckin[] = [
  {
    id: "assigned-weekly",
    title: "Tedenski check-in",
    schedule: "Vsako nedeljo",
    nextDue: "22.03.2026",
    status: "Aktiven",
    questionCount: 13,
    description:
      "Glavni tedenski obrazec za spremljanje energije, treninga, prehrane in splosnega ritma.",
    previewClassName:
      "bg-linear-to-br from-fuchsia-100 via-rose-50 to-white text-fuchsia-500",
  },
  {
    id: "assigned-daily",
    title: "Dnevni check-in",
    schedule: "Vsak dan",
    nextDue: "18.03.2026",
    status: "Dodeljen",
    questionCount: 10,
    description:
      "Kratek dnevni obrazec za pocutje, energijo in osnovni adherence signal cez teden.",
    previewClassName:
      "bg-linear-to-br from-sky-100 via-cyan-50 to-white text-sky-500",
  },
]

const improvementOptions = [
  "Moc",
  "Cardio",
  "Mobilnost",
  "Prehrana",
  "Recovery",
]

function getStatusBadgeClassName(status: SubmittedCheckin["status"]) {
  switch (status) {
    case "Pregledan":
      return "border-lime-200 bg-lime-50 text-lime-700"
    case "Caka na pregled":
      return "border-amber-200 bg-amber-50 text-amber-700"
    default:
      return "border-sky-200 bg-sky-50 text-sky-700"
  }
}

function DetailField({
  label,
  value,
  compact = false,
}: {
  label: string
  value: React.ReactNode
  compact?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="text-[13px] font-medium text-neutral-800">{label}</div>
      <div
        className={cn(
          "rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-700 shadow-none",
          compact && "inline-flex min-w-[84px] items-center"
        )}
      >
        {value}
      </div>
    </div>
  )
}

function ScoreScale({ value }: { value: number }) {
  const progress = ((value - 1) / 9) * 100

  return (
    <div className="space-y-3">
      <div className="relative h-1 rounded-full bg-sky-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-white bg-brand-500 shadow-sm"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
      <div className="grid grid-cols-10 text-center text-[11px] text-neutral-500">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index + 1}>{index + 1}</span>
        ))}
      </div>
    </div>
  )
}

function SatisfactionScale({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }, (_, index) => {
        const isActive = index < value

        return (
          <div
            key={index}
            className={cn(
              "size-5 rounded-full border",
              isActive
                ? "border-amber-300 bg-amber-400"
                : "border-neutral-200 bg-neutral-100"
            )}
          />
        )
      })}
    </div>
  )
}

export function SubmittedCheckinsPanel({
  clientName,
}: {
  clientName: string
}) {
  const [activeId, setActiveId] = React.useState(submittedCheckins[0]?.id)
  const [reviewDraft, setReviewDraft] = React.useState("")
  const activeCheckin =
    submittedCheckins.find((item) => item.id === activeId) ?? submittedCheckins[0]

  React.useEffect(() => {
    setReviewDraft("")
  }, [activeCheckin.id])

  return (
    <div className="grid gap-0 xl:grid-cols-[336px_minmax(0,1fr)]">
      <aside className="w-full rounded-none border-r border-neutral-200 bg-neutral-50 shadow-none xl:min-w-[336px] xl:sticky xl:top-12 xl:h-[calc(100vh-7rem)] xl:self-start xl:overflow-hidden">


        <div className="space-y-1.5 p-2 xl:max-h-[calc(100vh-10.5rem)] xl:overflow-y-auto [scrollbar-color:var(--color-neutral-200)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
          {submittedCheckins.map((item) => {
            const isActive = item.id === activeCheckin.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-start gap-2 rounded-md border px-3 py-3 text-left transition-colors",
                  isActive
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-neutral-200/70 bg-white hover:bg-neutral-50"
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div>
                    <div
                      className={cn(
                        "text-[14px] font-medium",
                        isActive ? "text-neutral-900" : "text-neutral-700"
                      )}
                    >
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">{item.date}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-sm px-1.5 py-0 text-[11px] font-medium",
                      getStatusBadgeClassName(item.status)
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      <Card className="gap-0  bg-neutral-50 py-0 border-none shadow-none xl:rounded-l-none">
        <CardHeader className="gap-3 px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-[18px] font-semibold text-neutral-950">
                {activeCheckin.title}
              </CardTitle>
              <CardDescription className="mt-1 text-[13px]">
                Oddani odgovori za {clientName} dne {activeCheckin.date}.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-sm px-2 py-0.5 text-[11px] font-medium",
                  getStatusBadgeClassName(activeCheckin.status)
                )}
              >
                {activeCheckin.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50"
              >
                Odpri v obrazcu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-0 px-0 py-0">
          <div className="space-y-5 px-5 py-4 pb-32">
            <DetailField
              label="1. Kaj je bil tvoj najvecji napredek ta teden?"
              value={activeCheckin.biggestWin}
            />

            <DetailField
              label="2. Koliko treningov si opravil ta teden?"
              value={activeCheckin.workoutsCompleted}
              compact
            />

            <DetailField
              label="3. Ali si dosegel glavni fokus tedna?"
              value={activeCheckin.reachedTarget}
              compact
            />

            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-800">
                4. Kako bi ocenil svoj napredek ta teden na lestvici 1-10?
              </div>
              <div className="rounded-sm border border-neutral-200 bg-white px-4 py-4">
                <ScoreScale value={activeCheckin.progressScore} />
              </div>
            </div>

            <DetailField
              label="5. Kateri dan v tednu si imel najvec energije?"
              value={activeCheckin.bestDay}
              compact
            />

            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-800">
                6. Kako zadovoljen si bil s svojim tednom?
              </div>
              <div className="rounded-sm border border-neutral-200 bg-white px-3 py-3">
                <SatisfactionScale value={activeCheckin.satisfaction} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-800">
                7. Fotografije napredka
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-sm border border-neutral-200 bg-white px-3 py-3">
                {["Front", "Side"].map((label, index) => (
                  <div
                    key={label}
                    className={cn(
                      "flex h-24 w-20 items-end justify-center rounded-sm border border-neutral-200 pb-2 text-[11px] font-medium text-neutral-500",
                      index === 0
                        ? "bg-linear-to-b from-orange-50 to-orange-100"
                        : "bg-linear-to-b from-amber-50 to-amber-100"
                    )}
                  >
                    {label}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50"
                >
                  Primerjaj
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-800">
                8. Na katerem podrocju si najbolj napredoval?
              </div>
              <div className="space-y-2 rounded-sm border border-neutral-200 bg-white px-3 py-3">
                {improvementOptions.map((option) => {
                  const isSelected = option === activeCheckin.improvementArea

                  return (
                    <div
                      key={option}
                      className={cn(
                        "flex items-center gap-2 text-[13px]",
                        isSelected ? "text-neutral-900" : "text-neutral-500"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-brand-500 bg-brand-500"
                            : "border-neutral-300 bg-white"
                        )}
                      >
                        {isSelected ? (
                          <span className="size-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                      {option}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-neutral-200/80 bg-neutral-50/95 px-5 py-4 backdrop-blur-sm">
            <div className="rounded-sm border border-brand-200/70  px-4 py-4 shadow-[0_-10px_20px_-18px_rgba(17,24,39,0.2)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <IconPencil className="size-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-neutral-950">
                      Pregled check-ina
                    </div>
                    <div className="mt-1 text-[13px] text-neutral-600">
                      Dodaj povratno informacijo, naslednje korake ali opombe za stranko.
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={!reviewDraft.trim()}
                  onClick={() => setReviewDraft("")}
                  className="rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
                >
                  Oddaj pregled
                </Button>
              </div>
              <textarea
                value={reviewDraft}
                onChange={(event) => setReviewDraft(event.target.value)}
                placeholder="Vnesi povratno informacijo, komentarje ali naslednje korake za stranko..."
                className="mt-4 min-h-[96px] w-full resize-none rounded-sm border border-brand-200 bg-white px-3 py-2 text-[13px] text-neutral-700 shadow-none outline-none placeholder:text-neutral-400 focus:border-brand-300 focus:ring-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AssignedCheckinsPanel() {
  return (
    <div className="px-2 mt-2 bg-neutral-50">
      <div className="overflow-hidden rounded-sm border border-neutral-200 ">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 lg:pl-5">Obrazec</TableHead>
              <TableHead>Urnik</TableHead>
              <TableHead>Naslednji rok</TableHead>
              <TableHead className="px-1 pr-2 lg:pr-3">
                <div className="w-6" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedCheckins.map((item) => (
              <TableRow key={item.id} className="bg-white">
                <TableCell className="pl-4 lg:pl-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-end justify-end rounded-sm border border-neutral-200 p-1.5",
                        item.previewClassName
                      )}
                    >
                      <div className="h-4 w-3 rounded-[2px] border border-white/80 bg-white/80" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-neutral-900">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-[13px] text-neutral-500">
                        {item.questionCount} vprasanj
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="rounded-sm border-sky-200 bg-sky-50 px-1.5 py-0 text-[11px] font-medium text-sky-700"
                  >
                    {item.schedule}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="rounded-sm border-amber-200 bg-amber-50 px-1.5 py-0 text-[11px] font-medium text-amber-700"
                  >
                    {item.nextDue}
                  </Badge>
                </TableCell>
                <TableCell className="px-1 pr-2 lg:pr-3">
                  <div className="flex w-6 justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="size-6 cursor-pointer rounded-md border-neutral-200/45 bg-transparent text-muted-foreground shadow-none transition-colors hover:border-neutral-200/70 hover:bg-neutral-50/70 hover:text-foreground data-[state=open]:border-neutral-200/70 data-[state=open]:bg-neutral-50/80"
                        >
                          <IconDotsVertical className="size-3" />
                          <span className="sr-only">Odpri meni check-ina</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-48 rounded-lg border-neutral-200/60 bg-white/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-sm"
                      >
                        <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50 focus:text-neutral-950">
                          <IconPencil className="size-4 text-neutral-500" />
                          Uredi
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50 focus:text-neutral-950">
                          <IconSend className="size-4 text-neutral-500" />
                          Poslji zdaj
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-neutral-200/70" />
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer rounded-md px-3 py-2 text-[13px]"
                        >
                          <IconTrash className="size-4" />
                          Izbrisi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
