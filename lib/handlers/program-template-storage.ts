"use client"

import type { StoredProgramPlan } from "@/types"

const PROGRAM_TEMPLATE_STORAGE_KEY = "coachwise:program-templates"

export const PROGRAM_TEMPLATES_UPDATED_EVENT = "coachwise:program-templates-updated"

function isStoredProgramTemplate(value: unknown): value is StoredProgramPlan {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<StoredProgramPlan>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.createdAt === "string" &&
    Array.isArray(candidate.workouts) &&
    (candidate.status === "Active" || candidate.status === "Disabled") &&
    Boolean(candidate.program) &&
    Array.isArray(candidate.program?.workouts) &&
    Array.isArray(candidate.program?.editorWorkouts)
  )
}

function dispatchProgramTemplatesUpdated() {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new CustomEvent(PROGRAM_TEMPLATES_UPDATED_EVENT))
}

export function readStoredProgramTemplates() {
  if (typeof window === "undefined") {
    return [] as StoredProgramPlan[]
  }

  try {
    const rawValue = window.localStorage.getItem(PROGRAM_TEMPLATE_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue)
      ? parsedValue.filter(isStoredProgramTemplate)
      : []
  } catch {
    return []
  }
}

export function readStoredProgramTemplate(templateId: string) {
  return readStoredProgramTemplates().find((template) => template.id === templateId) ?? null
}

export function writeStoredProgramTemplates(templates: StoredProgramPlan[]) {
  if (typeof window === "undefined") {
    return
  }

  if (!templates.length) {
    window.localStorage.removeItem(PROGRAM_TEMPLATE_STORAGE_KEY)
    dispatchProgramTemplatesUpdated()
    return
  }

  window.localStorage.setItem(PROGRAM_TEMPLATE_STORAGE_KEY, JSON.stringify(templates))
  dispatchProgramTemplatesUpdated()
}

export function upsertStoredProgramTemplate(template: StoredProgramPlan) {
  const currentTemplates = readStoredProgramTemplates()
  writeStoredProgramTemplates([
    template,
    ...currentTemplates.filter((currentTemplate) => currentTemplate.id !== template.id),
  ])
}

export function removeStoredProgramTemplate(templateId: string) {
  const currentTemplates = readStoredProgramTemplates()
  const nextTemplates = currentTemplates.filter((template) => template.id !== templateId)

  if (nextTemplates.length === currentTemplates.length) {
    return
  }

  writeStoredProgramTemplates(nextTemplates)
}
