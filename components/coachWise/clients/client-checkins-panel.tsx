"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconDotsVertical,
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconSend,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react"
import { usePathname, useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
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
  questions: AssignedCheckinQuestion[]
}

type AssignedCheckinQuestion = {
  id: string
  prompt: string
  helper?: string
  type: string
  required: boolean
  token: string
  tokenClassName: string
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
    questions: [
      {
        id: "q1",
        prompt: "Kaj je bil tvoj najvecji napredek ta teden?",
        type: "Besedilo",
        required: true,
        token: "Aa",
        tokenClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
      {
        id: "q2",
        prompt: "Koliko treningov si opravil ta teden?",
        type: "Stevilo",
        required: true,
        token: "1",
        tokenClassName: "border-rose-200 bg-rose-50 text-rose-700",
      },
      {
        id: "q3",
        prompt: "Ali si dosegel glavni fokus tedna?",
        type: "Da / Ne",
        required: true,
        token: "Da",
        tokenClassName: "border-violet-200 bg-violet-50 text-violet-700",
      },
      {
        id: "q4",
        prompt: "Kako bi ocenil svoj napredek ta teden na lestvici 1-10?",
        type: "Lestvica",
        required: true,
        token: "10",
        tokenClassName: "border-sky-200 bg-sky-50 text-sky-700",
      },
      {
        id: "q5",
        prompt: "Kateri dan v tednu si imel najvec energije?",
        type: "Datum",
        required: true,
        token: "12",
        tokenClassName: "border-slate-200 bg-slate-50 text-slate-700",
      },
      {
        id: "q6",
        prompt: "Kako zadovoljen si bil s svojim tednom?",
        type: "Ocena",
        required: true,
        token: "★",
        tokenClassName: "border-amber-200 bg-amber-50 text-amber-700",
      },
      {
        id: "q7",
        prompt: "Nalozi fotografije napredka za ta teden",
        type: "Fotografije",
        required: true,
        token: "Img",
        tokenClassName: "border-cyan-200 bg-cyan-50 text-cyan-700",
      },
      {
        id: "q8",
        prompt: "Na katerem podrocju si najbolj napredoval?",
        type: "Izbira",
        required: true,
        token: "✓",
        tokenClassName: "border-orange-200 bg-orange-50 text-orange-700",
      },
      {
        id: "q9",
        prompt: "Povprecno stevilo korakov ta teden",
        helper: "Koraki / dan",
        type: "Metrika",
        required: true,
        token: "123",
        tokenClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
      },
      {
        id: "q10",
        prompt: "Telesna teza ob koncu tedna",
        helper: "Teza (kg)",
        type: "Metrika",
        required: true,
        token: "kg",
        tokenClassName: "border-indigo-200 bg-indigo-50 text-indigo-700",
      },
      {
        id: "q11",
        prompt: "Koliko ur spanja si povprecno imel vsako noc?",
        type: "Stevilo",
        required: true,
        token: "1",
        tokenClassName: "border-rose-200 bg-rose-50 text-rose-700",
      },
      {
        id: "q12",
        prompt: "Povej, kako si se na splosno pocutil ta teden",
        type: "Besedilo",
        required: true,
        token: "Aa",
        tokenClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
    ],
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
    questions: [
      {
        id: "dq1",
        prompt: "Kako se danes pocutis?",
        type: "Besedilo",
        required: true,
        token: "Aa",
        tokenClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
      {
        id: "dq2",
        prompt: "Koliko energije imas danes?",
        type: "Lestvica",
        required: true,
        token: "10",
        tokenClassName: "border-sky-200 bg-sky-50 text-sky-700",
      },
      {
        id: "dq3",
        prompt: "Ali si danes opravil planiran trening?",
        type: "Da / Ne",
        required: true,
        token: "Da",
        tokenClassName: "border-violet-200 bg-violet-50 text-violet-700",
      },
      {
        id: "dq4",
        prompt: "Koliko korakov si naredil danes?",
        type: "Metrika",
        required: false,
        token: "123",
        tokenClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
      },
      {
        id: "dq5",
        prompt: "Dodaj kratko opombo dneva",
        type: "Besedilo",
        required: false,
        token: "Aa",
        tokenClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
    ],
  },
]

const improvementOptions = [
  "Moc",
  "Cardio",
  "Mobilnost",
  "Prehrana",
  "Recovery",
]

const questionTypeOptions = [
  {
    id: "text",
    title: "Besedilo",
    description: "Kratek ali daljsi tekstovni odgovor.",
    token: "Aa",
    tokenClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    id: "number",
    title: "Stevilo",
    description: "Celo ali decimalno stevilo.",
    token: "1",
    tokenClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
  {
    id: "choice",
    title: "Vec moznosti",
    description: "Izbira ene ali vec moznosti.",
    token: "✓",
    tokenClassName: "border-orange-200 bg-orange-50 text-orange-700",
  },
  {
    id: "scale",
    title: "Lestvica",
    description: "Ocena na lestvici od 1 do 10.",
    token: "10",
    tokenClassName: "border-sky-200 bg-sky-50 text-sky-700",
  },
  {
    id: "yes-no",
    title: "Da / Ne",
    description: "Enostaven odgovor z da ali ne.",
    token: "Da",
    tokenClassName: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    id: "media",
    title: "Medij",
    description: "Ena slika ali video.",
    token: "Vid",
    tokenClassName: "border-lime-200 bg-lime-50 text-lime-700",
  },
  {
    id: "date",
    title: "Datum",
    description: "Izbira konkretnega datuma.",
    token: "12",
    tokenClassName: "border-slate-200 bg-slate-50 text-slate-700",
  },
  {
    id: "rating",
    title: "Ocena",
    description: "Ocena od 1 do 5.",
    token: "★",
    tokenClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
]

const syncedQuestionOptions = [
  {
    id: "progress-photos",
    title: "Fotografije napredka",
    description: "Sinhroniziraj fotografije v galerijo.",
    token: "Img",
    tokenClassName: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  {
    id: "metric",
    title: "Metrika",
    description: "Sinhroniziraj v sekcijo metrik.",
    token: "123",
    tokenClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
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

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest(
      "button, a, input, textarea, select, [data-prevent-row-click='true']"
    )
  )
}

function RequiredBadge({ required }: { required: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-sm px-1.5 py-0 text-[11px] font-medium",
        required
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-lime-200 bg-lime-50 text-lime-700"
      )}
    >
      {required ? "Da" : "Ne"}
    </Badge>
  )
}

function QuestionToken({
  token,
  className,
}: {
  token: string
  className: string
}) {
  return (
    <div
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-sm border px-1.5 text-[11px] font-semibold",
        className
      )}
    >
      {token}
    </div>
  )
}

function getAssignedCheckinById(checkinId: string) {
  return assignedCheckins.find((item) => item.id === checkinId) ?? null
}

function AddQuestionDialog() {
  const [open, setOpen] = React.useState(false)
  const [questionLabel, setQuestionLabel] = React.useState("")
  const [isRequired, setIsRequired] = React.useState(true)
  const [selectedType, setSelectedType] = React.useState("text")

  const resetDialog = React.useCallback(() => {
    setQuestionLabel("")
    setIsRequired(true)
    setSelectedType("text")
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          resetDialog()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
        >
          <IconPlus className="size-4" />
          Dodaj vprasanje
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[700px]">
        <div className="border-b border-neutral-200 px-5 py-4">
          <DialogTitle className="text-[18px] font-semibold text-neutral-950">
            Dodaj vprasanje
          </DialogTitle>
        </div>

        <div className="space-y-5 px-5 py-4">
          <div className="space-y-2">
            <div className="text-[13px] font-medium text-neutral-800">
              Vprasanje <span className="text-rose-500">*</span>
            </div>
            <Input
              value={questionLabel}
              onChange={(event) => setQuestionLabel(event.target.value)}
              placeholder="Vnesi vprasanje, npr. Kako se danes pocutis?"
              className="rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-[13px] text-neutral-700">
            <Checkbox
              checked={isRequired}
              onCheckedChange={(checked) => setIsRequired(checked === true)}
              className="rounded-[4px] border-neutral-300 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500"
            />
            <span>Obvezno?</span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {questionTypeOptions.map((option) => {
              const isSelected = option.id === selectedType

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedType(option.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-sm border px-3 py-3 text-left transition-colors",
                    isSelected
                      ? "border-brand-500 bg-brand-500/5"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  )}
                >
                  <QuestionToken
                    token={option.token}
                    className={option.tokenClassName}
                  />
                  <div>
                    <div className="text-[14px] font-medium text-neutral-900">
                      {option.title}
                    </div>
                    <div className="mt-1 text-[13px] text-neutral-500">
                      {option.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <div className="mb-3 text-center text-[13px] font-medium text-neutral-500">
              Sinhronizirana vprasanja
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {syncedQuestionOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="flex items-start gap-3 rounded-sm border border-neutral-200 bg-white px-3 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <QuestionToken
                    token={option.token}
                    className={option.tokenClassName}
                  />
                  <div>
                    <div className="text-[14px] font-medium text-neutral-900">
                      {option.title}
                    </div>
                    <div className="mt-1 text-[13px] text-neutral-500">
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="justify-between border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              Zapri
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!questionLabel.trim()}
            onClick={() => setOpen(false)}
            className="rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
          >
            Dodaj vprasanje
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditAssignedCheckinDialog({
  title,
  description,
  previewClassName,
  onSave,
}: {
  title: string
  description: string
  previewClassName: string
  onSave: (values: { title: string; description: string }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [draftTitle, setDraftTitle] = React.useState(title)
  const [draftDescription, setDraftDescription] = React.useState(description)

  const resetDialog = React.useCallback(() => {
    setDraftTitle(title)
    setDraftDescription(description)
  }, [description, title])

  React.useEffect(() => {
    if (!open) {
      resetDialog()
    }
  }, [open, resetDialog])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          resetDialog()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50"
        >
          <IconPencil className="size-4" />
          Uredi
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[700px]">
        <div className="border-b border-neutral-200 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
            <IconPencil className="size-4.5 text-neutral-500" />
            Uredi check-in
          </DialogTitle>
        </div>

        <div className="space-y-5 px-5 py-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_72px] md:items-start">
            <div className="space-y-2">
              <div className="text-[13px] font-medium text-neutral-800">
                Naziv obrazca <span className="text-rose-500">*</span>
              </div>
              <Input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="Vnesi naziv obrazca"
                className="rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
              />
            </div>

            <div
              className={cn(
                "flex size-[60px] shrink-0 items-end justify-end rounded-sm border border-neutral-200 p-2",
                previewClassName
              )}
            >
              <div className="h-7 w-5 rounded-[3px] border border-white/80 bg-white/80" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[13px] font-medium text-neutral-800">
              Opis obrazca
            </div>
            <textarea
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              maxLength={1000}
              placeholder="Vnesi dodatne informacije"
              rows={3}
              className="flex min-h-[88px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300"
            />
            <div className="text-right text-[12px] text-neutral-400">
              {draftDescription.length} / 1000
            </div>
          </div>
        </div>

        <DialogFooter className="justify-between border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              Zapri
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!draftTitle.trim()}
            onClick={() => {
              onSave({
                title: draftTitle.trim(),
                description: draftDescription.trim(),
              })
              setOpen(false)
            }}
            className="rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
          >
            Posodobi check-in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function QuestionDragHandle({
  attributes,
  listeners,
}: {
  attributes: ReturnType<typeof useSortable>["attributes"]
  listeners: ReturnType<typeof useSortable>["listeners"]
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-7 cursor-grab text-neutral-400 shadow-none hover:bg-transparent hover:text-neutral-600 active:cursor-grabbing"
      data-prevent-row-click="true"
      {...attributes}
      {...listeners}
    >
      <IconGripVertical className="size-3.5" />
      <span className="sr-only">Premakni vprasanje</span>
    </Button>
  )
}

function SortableQuestionRow({
  question,
}: {
  question: AssignedCheckinQuestion
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: question.id,
    })

  return (
    <TableRow
      ref={setNodeRef}
      className="bg-white data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <TableCell className="w-8 pl-3 pr-0">
        <div className="flex items-center justify-center">
          <QuestionDragHandle
            attributes={attributes}
            listeners={listeners}
          />
        </div>
      </TableCell>
      <TableCell className="pl-2 lg:pl-3">
        <div className="flex items-start gap-3">
          <QuestionToken
            token={question.token}
            className={question.tokenClassName}
          />
          <div className="min-w-0">
            <div className="text-[14px] font-medium text-neutral-900">
              {question.prompt}
            </div>
            {question.helper ? (
              <div className="mt-0.5 text-[13px] text-neutral-500">
                {question.helper}
              </div>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-[14px] text-neutral-800">
        {question.type}
      </TableCell>
      <TableCell>
        <RequiredBadge required={question.required} />
      </TableCell>
      <TableCell className="px-1 pr-2 lg:pr-3">
        <div className="flex w-6 justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-6 rounded-md border-neutral-200/70 bg-transparent text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
          >
            <IconTrash className="size-3.5" />
            <span className="sr-only">Izbrisi vprasanje</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function PreviewScaleInput() {
  return (
    <div className="space-y-2.5">
      <div className="relative h-1 rounded-full bg-sky-100">
        <div className="absolute top-1/2 left-0 size-4 -translate-y-1/2 rounded-full border-2 border-white bg-slate-300 shadow-sm" />
      </div>
      <div className="grid grid-cols-10 text-center text-[11px] text-neutral-500">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index + 1}>{index + 1}</span>
        ))}
      </div>
    </div>
  )
}

function PreviewRatingInput() {
  return (
    <div className="flex items-center gap-1.5 text-neutral-300">
      {Array.from({ length: 5 }, (_, index) => (
        <IconStarFilled key={index} className="size-6" />
      ))}
    </div>
  )
}

function PreviewUploadInput() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {["Front", "Back", "Side"].map((label) => (
        <div
          key={label}
          className="flex h-20 w-20 items-center justify-center rounded-sm border border-dashed border-neutral-300 bg-white text-[13px] text-neutral-600"
        >
          {label}
        </div>
      ))}
    </div>
  )
}

function PreviewChoiceInput() {
  return (
    <div className="space-y-2.5">
      {improvementOptions.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2.5 text-[14px] text-neutral-600"
        >
          <span className="size-4 rounded-full border border-neutral-300 bg-white" />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}

function PreviewQuestionField({
  question,
  index,
}: {
  question: AssignedCheckinQuestion
  index: number
}) {
  const label = `${index + 1}. ${question.prompt}`

  switch (question.type) {
    case "Stevilo":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
            <span className="ml-1 text-[12px] text-neutral-500">
              (samo stevilo)
            </span>
          </div>
          <Input
            readOnly
            placeholder="Vnesi stevilo"
            className="h-9 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
          />
        </div>
      )
    case "Da / Ne":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <div className="inline-flex overflow-hidden rounded-sm border border-neutral-200 bg-white">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none px-4 text-neutral-700 shadow-none hover:bg-neutral-50"
            >
              Da
            </Button>
            <div className="w-px bg-neutral-200" />
            <Button
              type="button"
              variant="ghost"
              className="rounded-none px-4 text-neutral-700 shadow-none hover:bg-neutral-50"
            >
              Ne
            </Button>
          </div>
        </div>
      )
    case "Lestvica":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <PreviewScaleInput />
        </div>
      )
    case "Datum":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <div className="inline-flex h-9 min-w-[160px] items-center justify-between gap-3 rounded-sm border border-neutral-200 bg-white px-3 text-[14px] text-neutral-400">
            <span>Izberi datum</span>
            <IconCalendarEvent className="size-4 text-neutral-400" />
          </div>
        </div>
      )
    case "Ocena":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <PreviewRatingInput />
        </div>
      )
    case "Fotografije":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <PreviewUploadInput />
        </div>
      )
    case "Izbira":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <PreviewChoiceInput />
        </div>
      )
    case "Metrika":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
            {question.helper ? (
              <span className="ml-1 text-[12px] text-neutral-500">
                ({question.helper})
              </span>
            ) : null}
          </div>
          <Input
            readOnly
            placeholder="Vnesi vrednost"
            className="h-9 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
          />
        </div>
      )
    case "Medij":
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <div className="flex h-24 items-center justify-center gap-2 rounded-sm border border-dashed border-neutral-300 bg-white text-[13px] text-neutral-500">
            <IconPhoto className="size-4" />
            Nalozi sliko ali video
          </div>
        </div>
      )
    default:
      return (
        <div className="space-y-2.5">
          <div className="text-[13px] font-medium text-neutral-900">
            {label}
            {question.required ? (
              <span className="ml-1 text-rose-500">*</span>
            ) : null}
          </div>
          <Input
            readOnly
            placeholder="Vnesi odgovor"
            className="h-9 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
          />
        </div>
      )
  }
}

function AssignedCheckinPreview({
  questions,
}: {
  questions: AssignedCheckinQuestion[]
}) {
  return (
    <div className="space-y-7 rounded-sm border border-neutral-200 bg-neutral-50 px-4 py-5 lg:px-5">
      {questions.map((question, index) => (
        <PreviewQuestionField
          key={question.id}
          question={question}
          index={index}
        />
      ))}
    </div>
  )
}

function AssignedCheckinEditor({
  checkin,
  onBack,
}: {
  checkin: AssignedCheckin
  onBack: () => void
}) {
  const [questions, setQuestions] = React.useState(checkin.questions)
  const [formMeta, setFormMeta] = React.useState({
    title: checkin.title,
    description: checkin.description,
  })
  const [isPreview, setIsPreview] = React.useState(false)
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  const questionIds = React.useMemo<UniqueIdentifier[]>(
    () => questions.map((question) => question.id),
    [questions]
  )

  React.useEffect(() => {
    setQuestions(checkin.questions)
    setFormMeta({
      title: checkin.title,
      description: checkin.description,
    })
    setIsPreview(false)
  }, [checkin.description, checkin.id, checkin.questions, checkin.title])

  function handleQuestionDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setQuestions((currentQuestions) => {
        const oldIndex = currentQuestions.findIndex(
          (question) => question.id === active.id
        )
        const newIndex = currentQuestions.findIndex(
          (question) => question.id === over.id
        )

        return arrayMove(currentQuestions, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="bg-neutral-50">
      <div className="border-b border-neutral-200 bg-neutral-50 px-2.5 py-2.5 lg:px-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              className="size-7 rounded-sm text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
            >
              <IconArrowLeft className="size-3.5" />
              <span className="sr-only">Nazaj</span>
            </Button>
            <div
              className={cn(
                "flex size-7 shrink-0 items-end justify-end rounded-sm border border-neutral-200 p-1.25",
                checkin.previewClassName
              )}
            >
              <div className="h-3.5 w-2.5 rounded-[2px] border border-white/80 bg-white/80" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-medium text-neutral-950">
                {formMeta.title}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <EditAssignedCheckinDialog
              title={formMeta.title}
              description={formMeta.description}
              previewClassName={checkin.previewClassName}
              onSave={(values) => setFormMeta(values)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreview((current) => !current)}
              className={cn(
                "rounded-sm shadow-none",
                isPreview
                  ? "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-50"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              )}
            >
              {isPreview ? (
                <IconEye className="size-4" />
              ) : (
                <IconEyeOff className="size-4" />
              )}
              Predogled
            </Button>
            <AddQuestionDialog />
          </div>
        </div>
      </div>

      <div className="px-2 py-2">
        {isPreview ? (
          <AssignedCheckinPreview questions={questions} />
        ) : (
          <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleQuestionDragEnd}
              sensors={sensors}
            >
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-8 pl-3 pr-0" />
                    <TableHead className="pl-2 lg:pl-3">Vprasanje</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Obvezno</TableHead>
                    <TableHead className="px-1 pr-2 lg:pr-3">
                      <div className="w-6" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext
                    items={questionIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {questions.map((question) => (
                      <SortableQuestionRow
                        key={question.id}
                        question={question}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          </div>
        )}
      </div>
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
  const router = useRouter()
  const pathname = usePathname()

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
              <TableRow
                key={item.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer bg-white"
                onClick={(event) => {
                  if (isInteractiveElement(event.target)) {
                    return
                  }

                  router.push(
                    `${pathname}?tab=checkins&checkinTab=assigned&assignedCheckin=${item.id}`
                  )
                }}
                onKeyDown={(event) => {
                  if (isInteractiveElement(event.target)) {
                    return
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    router.push(
                      `${pathname}?tab=checkins&checkinTab=assigned&assignedCheckin=${item.id}`
                    )
                  }
                }}
              >
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
                        <DropdownMenuItem
                          className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50 focus:text-neutral-950"
                          onSelect={() =>
                            router.push(
                              `${pathname}?tab=checkins&checkinTab=assigned&assignedCheckin=${item.id}`
                            )
                          }
                        >
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

export function AssignedCheckinDetailView({
  checkinId,
}: {
  checkinId: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const selectedCheckin = getAssignedCheckinById(checkinId)

  if (!selectedCheckin) {
    return (
      <div className="px-2 pt-2 text-sm text-neutral-500">
        Check-in ni najden.
      </div>
    )
  }

  return (
    <AssignedCheckinEditor
      checkin={selectedCheckin}
      onBack={() => router.push(`${pathname}?tab=checkins&checkinTab=assigned`)}
    />
  )
}
