"use client"

import * as React from "react"
import {
  IconArrowRight,
  IconInfoCircle,
  IconPlus,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"
import { CalendarIcon, X } from "lucide-react"

import { overflowActionsMenuSurfaceClassName } from "@/components/coachWise/overflow-actions-menu"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type AddClientDialogProps = {
  label?: string
  icon?: Icon
  trigger?: React.ReactNode
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <Label className="text-[13px] font-medium text-neutral-800">
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </Label>
  )
}

function formatPickerDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function DatePickerField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: Date | undefined
  onChange: (value: Date | undefined) => void
  disabled?: (date: Date) => boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value ?? new Date())

  React.useEffect(() => {
    if (value) {
      setMonth(value)
    }
  }, [value])

  return (
    <div className="min-w-0 flex-1 space-y-2">
      <Label className="text-[13px] font-medium text-neutral-700">{label}</Label>
      <div className="relative">
        <Input
          value={formatPickerDate(value)}
          readOnly
          placeholder="Select date"
          className="cursor-pointer rounded-sm border-neutral-200/80 bg-white pr-10 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
          onClick={() => setOpen(true)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-1.5 size-6 -translate-y-1/2 rounded-sm text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-600"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-auto overflow-hidden rounded-sm border-neutral-200/80 p-0 shadow-lg shadow-black/5"
          >
            <Calendar
              mode="single"
              month={month}
              selected={value}
              disabled={disabled}
              onMonthChange={setMonth}
              onSelect={(date) => {
                onChange(date)
                if (date) {
                  setOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export function AddClientDialog({
  label = "Add Client",
  icon: TriggerIcon = IconPlus,
  trigger,
}: AddClientDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [hasCustomDates, setHasCustomDates] = React.useState(false)
  const [sendLoginEmail, setSendLoginEmail] = React.useState(true)
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
    },
    []
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <PrimaryActionButton
            label={label}
            icon={TriggerIcon}
          />
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayProps={{
          onClick: handleOverlayClick,
          onMouseDown: (event) => {
            event.stopPropagation()
          },
          onPointerDown: (event) => {
            event.stopPropagation()
          },
        }}
        onClick={(event) => {
          event.stopPropagation()
        }}
        onMouseDown={(event) => {
          event.stopPropagation()
        }}
        onPointerDown={(event) => {
          event.stopPropagation()
        }}
        onPointerDownOutside={(event) => {
          event.preventDefault()
        }}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
        className={cn(
          overflowActionsMenuSurfaceClassName,
          "w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden border-white/70 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:max-w-[700px]"
        )}
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3 z-20 size-8 cursor-pointer rounded-md text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" />
            <span className="sr-only">Close dialog</span>
          </Button>
        </DialogClose>

        <DialogHeader className="gap-0 border-b border-neutral-200/80 px-5 pt-5 pb-4 text-left">
          <div className="flex items-start gap-3 pr-10">
            <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200/80 bg-neutral-50/90 text-neutral-600">
              <IconUsersGroup className="size-[18px]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-[16px] font-semibold text-neutral-950">
                Add client
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-5 text-neutral-500">
                Create a new client, assign onboarding details, and optionally
                set custom dates.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          className="space-y-4 px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <div className="space-y-2">
            <FieldLabel required>Full name</FieldLabel>
            <Input
              placeholder="Enter full name"
              className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel required>Client email</FieldLabel>
            <Input
              type="email"
              placeholder="Enter client email"
              className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Client tag</FieldLabel>
            <Select>
              <SelectTrigger className="h-10 w-full rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[placeholder]:text-neutral-400">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="aktivni">Active</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel>Questionnaire</FieldLabel>
            <Select>
              <SelectTrigger className="h-10 w-full rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[placeholder]:text-neutral-400">
                <SelectValue placeholder="Select questionnaire" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="uvodni">Intro questionnaire</SelectItem>
                <SelectItem value="prehrana">Nutrition questionnaire</SelectItem>
                <SelectItem value="napredek">Weekly progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel>Onboarding flow</FieldLabel>
            <Select>
              <SelectTrigger className="h-10 w-full rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[placeholder]:text-neutral-400">
                <SelectValue placeholder="Select onboarding flow" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="brez">None</SelectItem>
                <SelectItem value="osnovni">Basic onboarding</SelectItem>
                <SelectItem value="napredni">Advanced onboarding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex cursor-pointer items-center gap-3 text-[13px] text-neutral-700">
              <Checkbox
                checked={hasCustomDates}
                onCheckedChange={(checked) => {
                  const nextValue = checked === true

                  setHasCustomDates(nextValue)

                  if (!nextValue) {
                    setStartDate(undefined)
                    setEndDate(undefined)
                  }
                }}
                className="rounded-[4px] border-neutral-300 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500"
              />
              <span className="flex items-center gap-1.5">
                Set start and end date?
                <IconInfoCircle className="size-3.5 text-neutral-400" />
              </span>
            </label>
            {hasCustomDates ? (
              <div className="grid gap-3 pl-7 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
                <DatePickerField
                  label="Start date"
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date)

                    if (date && endDate && endDate < date) {
                      setEndDate(undefined)
                    }
                  }}
                />
                <div className="hidden pb-2 text-neutral-400 sm:flex sm:items-center sm:justify-center">
                  <IconArrowRight className="size-4" />
                </div>
                <DatePickerField
                  label="End date"
                  value={endDate}
                  disabled={(date) => Boolean(startDate && date < startDate)}
                  onChange={setEndDate}
                />
              </div>
            ) : null}
            <label className="flex cursor-pointer items-center gap-3 text-[13px] text-neutral-700">
              <Checkbox
                checked={sendLoginEmail}
                onCheckedChange={(checked) => setSendLoginEmail(checked === true)}
                className="rounded-[4px] border-neutral-300 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500"
              />
              <span>Send login instructions by email</span>
            </label>
          </div>

          <DialogFooter className="border-t border-neutral-200/80 px-0 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <DialogClose asChild>
              <SecondaryActionButton label="Cancel" />
            </DialogClose>
            <PrimaryActionButton type="submit" label="Add Client" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
