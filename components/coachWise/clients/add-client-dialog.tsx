"use client"

import * as React from "react"
import {
  IconArrowRight,
  IconInfoCircle,
  IconPlus,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
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

type AddClientDialogProps = {
  label?: string
  icon?: Icon
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <Label className="text-[13px] font-medium text-neutral-700">
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </Label>
  )
}

function formatPickerDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("sl-SI", {
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
          placeholder="Izberi datum"
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
              <span className="sr-only">Izberi datum</span>
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
  label = "Dodaj stranko",
  icon: TriggerIcon = IconPlus,
}: AddClientDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [hasCustomDates, setHasCustomDates] = React.useState(false)
  const [sendLoginEmail, setSendLoginEmail] = React.useState(true)
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="shrink-0 rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
        >
          <TriggerIcon className="size-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-sm border border-neutral-200/80 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[700px]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200/70 px-5 py-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-sm border border-neutral-200/80 bg-neutral-50 text-neutral-600">
              <IconUsersGroup className="size-4" />
            </div>
            <DialogTitle className="text-base font-semibold text-neutral-950">
              Dodaj stranko
            </DialogTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-sm border-neutral-200/80 text-[13px] font-medium text-neutral-600 shadow-none hover:bg-neutral-50"
          >
            <IconUsersGroup className="size-4" />
            Dodaj vec strank
          </Button>
        </div>

        <form
          className="space-y-4 px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <div className="space-y-2">
            <FieldLabel required>Ime in priimek</FieldLabel>
            <Input
              placeholder="Vnesi ime in priimek"
              className="rounded-sm border-neutral-200/80 bg-white shadow-none focus-visible:border-neutral-500 focus-visible:ring-1"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel required>E-posta stranke</FieldLabel>
            <Input
              type="email"
              placeholder="Vnesi e-posto stranke"
              className="rounded-sm border-neutral-200/80 bg-white shadow-none focus-visible:border-neutral-500 focus-visible:ring-1"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Oznaka stranke</FieldLabel>
            <Select>
              <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200/80 bg-white text-sm shadow-none focus-visible:border-neutral-500 focus-visible:ring-1 data-[placeholder]:text-neutral-400">
                <SelectValue placeholder="Izberi oznako" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="aktivni">Aktivni</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel>Vprasalnik</FieldLabel>
            <Select>
              <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200/80 bg-white text-sm shadow-none focus-visible:border-neutral-500 focus-visible:ring-1 data-[placeholder]:text-neutral-400">
                <SelectValue placeholder="Izberi vprasalnik" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="uvodni">Uvodni vprasalnik</SelectItem>
                <SelectItem value="prehrana">Prehranski vprasalnik</SelectItem>
                <SelectItem value="napredek">Tedenski napredek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel>Onboarding flow</FieldLabel>
            <Select>
              <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200/80 bg-white text-sm shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[placeholder]:text-neutral-400">
                <SelectValue placeholder="Izberi onboarding flow" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
              >
                <SelectItem value="brez">Brez</SelectItem>
                <SelectItem value="osnovni">Osnovni onboarding</SelectItem>
                <SelectItem value="napredni">Napredni onboarding</SelectItem>
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
                Nastavi zacetni in koncni datum?
                <IconInfoCircle className="size-3.5 text-neutral-400" />
              </span>
            </label>
            {hasCustomDates ? (
              <div className="grid gap-3 pl-7 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
                <DatePickerField
                  label="Zacetni datum"
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
                  label="Koncni datum"
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
              <span>Poslji navodila za prijavo po e-posti</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
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
              type="submit"
              className="rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
            >
              Dodaj stranko
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
