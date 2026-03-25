"use client"

import * as React from "react"
import { UserRound, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ClientEditDialogProps = {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  phase: string
  trigger?: React.ReactNode
}

export function ClientEditDialog({
  firstName,
  lastName,
  email,
  phone,
  status,
  phase,
  trigger,
}: ClientEditDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    firstName,
    lastName,
    email,
    phone,
    status,
    phase,
  })

  React.useEffect(() => {
    if (open) {
      setForm({
        firstName,
        lastName,
        email,
        phone,
        status,
        phase,
      })
    }
  }, [email, firstName, lastName, open, phone, phase, status])

  const canSubmit =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.email.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
            Edit client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl border-neutral-200 p-0 shadow-xl sm:max-w-[720px]"
      >
        <DialogHeader className="border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-[15px] font-medium text-neutral-950">
              <UserRound className="size-4 text-neutral-500" />
              <span>Edit Client</span>
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-md text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid gap-5 px-4 py-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Ime <span className="text-rose-500">*</span>
            </label>
            <Input
              value={form.firstName}
              onChange={(event) =>
                setForm((current) => ({ ...current, firstName: event.target.value }))
              }
              className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Priimek <span className="text-rose-500">*</span>
            </label>
            <Input
              value={form.lastName}
              onChange={(event) =>
                setForm((current) => ({ ...current, lastName: event.target.value }))
              }
              className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Email <span className="text-rose-500">*</span>
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">
              Telefon
            </label>
            <Input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="+386 40 000 000"
              className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-neutral-800">Status</label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, status: value }))
              }
            >
              <SelectTrigger className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-neutral-200">
                <SelectItem value="Aktiven">Aktiven</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Na pavzi">Na pavzi</SelectItem>
                <SelectItem value="Zakljucen">Zakljucen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[13px] font-medium text-neutral-800">Faza</label>
            <Select
              value={form.phase}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, phase: value }))
              }
            >
              <SelectTrigger className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-neutral-200">
                <SelectItem value="Bulk">Bulk</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Cut">Cut</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => setOpen(false)}
            className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
