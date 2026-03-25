"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type ClientFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  phase: string
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="text-[13px] font-medium text-neutral-800">
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  )
}

type ClientFormFieldsProps = {
  values: ClientFormValues
  onFieldChange: <K extends keyof ClientFormValues>(
    field: K,
    value: ClientFormValues[K]
  ) => void
  container?: HTMLElement | null
  className?: string
}

export function ClientFormFields({
  values,
  onFieldChange,
  container,
  className,
}: ClientFormFieldsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <div className="space-y-2">
        <FieldLabel required>First name</FieldLabel>
        <Input
          value={values.firstName}
          onChange={(event) => onFieldChange("firstName", event.target.value)}
          className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel required>Last name</FieldLabel>
        <Input
          value={values.lastName}
          onChange={(event) => onFieldChange("lastName", event.target.value)}
          className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <FieldLabel required>Email</FieldLabel>
        <Input
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Phone</FieldLabel>
        <Input
          value={values.phone}
          onChange={(event) => onFieldChange("phone", event.target.value)}
          placeholder="+386 40 000 000"
          className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Status</FieldLabel>
        <Select
          value={values.status}
          onValueChange={(value) => onFieldChange("status", value)}
        >
          <SelectTrigger className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            container={container}
            className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
          >
            <SelectItem value="Aktiven">Active</SelectItem>
            <SelectItem value="Onboarding">Onboarding</SelectItem>
            <SelectItem value="Na pavzi">Paused</SelectItem>
            <SelectItem value="Zakljucen">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <FieldLabel>Phase</FieldLabel>
        <Select
          value={values.phase}
          onValueChange={(value) => onFieldChange("phase", value)}
        >
          <SelectTrigger className="h-10 rounded-sm border-neutral-200/80 bg-white text-[14px] shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            container={container}
            className="rounded-sm border-neutral-200/80 shadow-lg shadow-black/5"
          >
            <SelectItem value="Bulk">Bulk</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Cut">Cut</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
