"use client"

import * as React from "react"
import {
  IconPlus,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
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

export function AddClientDialog({
  label = "Dodaj stranko",
  icon: TriggerIcon = IconPlus,
}: AddClientDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [hasCustomDates, setHasCustomDates] = React.useState(false)
  const [sendLoginEmail, setSendLoginEmail] = React.useState(true)

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
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200/70 px-5 py-4">
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
              className="rounded-sm border-neutral-200/80 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel required>E-posta stranke</FieldLabel>
            <Input
              type="email"
              placeholder="Vnesi e-posto stranke"
              className="rounded-sm border-neutral-200/80 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>Oznaka stranke</FieldLabel>
            <Select>
              <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200/80 bg-white text-sm shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[placeholder]:text-neutral-400">
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
              <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200/80 bg-white text-sm shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[placeholder]:text-neutral-400">
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
                onCheckedChange={(checked) => setHasCustomDates(checked === true)}
                className="rounded-[4px] border-neutral-300 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500"
              />
              <span>Nastavi zacetni in koncni datum?</span>
            </label>
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
