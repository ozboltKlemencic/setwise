import type { StoredProgramPlan } from "@/types"

const PROGRAM_PLAN_STORAGE_KEY_PREFIX = "coachwise:program-plans:"
const PROGRAM_PLAN_STORAGE_INITIALIZED_KEY_PREFIX =
  "coachwise:program-plans:initialized:"

export const PROGRAM_PLANS_UPDATED_EVENT = "coachwise:program-plans-updated"
export const GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE = "global-programs"

function readStorageScopeFromPathQuery(path?: string | null) {
  if (!path || !path.includes("?")) {
    return null
  }

  const query = path.split("?")[1] ?? ""
  const searchParams = new URLSearchParams(query)
  return searchParams.get("storageScope")?.trim() || null
}

export function resolveProgramsClientIdFromPath(path?: string | null) {
  if (!path) {
    return null
  }

  return path.match(/\/clients\/([^/?#]+)\/programs(?:\/|$|\?)/)?.[1] ?? null
}

export function resolveProgramPlanStorageScopeFromPath(path?: string | null) {
  const storageScopeFromQuery = readStorageScopeFromPathQuery(path)
  if (storageScopeFromQuery) {
    return storageScopeFromQuery
  }

  const clientId = resolveProgramsClientIdFromPath(path)
  if (clientId) {
    return clientId
  }

  if (
    path &&
    /(?:^|\/)(?:[a-z]{2}\/)?beta-coach-wise\/programi(?:\/|$|\?)/i.test(path)
  ) {
    return GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE
  }

  return null
}

function getProgramPlanStorageKey(storageScopeId: string) {
  return `${PROGRAM_PLAN_STORAGE_KEY_PREFIX}${storageScopeId}`
}

function getProgramPlanInitializedKey(storageScopeId: string) {
  return `${PROGRAM_PLAN_STORAGE_INITIALIZED_KEY_PREFIX}${storageScopeId}`
}

function isStoredProgramPlan(value: unknown): value is StoredProgramPlan {
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

function dispatchProgramPlansUpdated(storageScopeId: string) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent(PROGRAM_PLANS_UPDATED_EVENT, {
      detail: { storageScopeId },
    })
  )
}

export function readStoredProgramPlans(storageScopeId: string) {
  if (typeof window === "undefined") {
    return [] as StoredProgramPlan[]
  }

  try {
    const rawValue = window.localStorage.getItem(
      getProgramPlanStorageKey(storageScopeId)
    )

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue)
      ? parsedValue.filter(isStoredProgramPlan)
      : []
  } catch {
    return []
  }
}

export function writeStoredProgramPlans(
  storageScopeId: string,
  plans: StoredProgramPlan[]
) {
  if (typeof window === "undefined") {
    return
  }

  const storageKey = getProgramPlanStorageKey(storageScopeId)
  window.localStorage.setItem(
    getProgramPlanInitializedKey(storageScopeId),
    "true"
  )

  if (!plans.length) {
    window.localStorage.removeItem(storageKey)
    dispatchProgramPlansUpdated(storageScopeId)
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(plans))
  dispatchProgramPlansUpdated(storageScopeId)
}

export function ensureStoredProgramPlans(
  storageScopeId: string,
  seedPlans: StoredProgramPlan[]
) {
  if (typeof window === "undefined") {
    return seedPlans
  }

  const initializedKey = getProgramPlanInitializedKey(storageScopeId)
  const currentPlans = readStoredProgramPlans(storageScopeId)

  if (window.localStorage.getItem(initializedKey)) {
    return currentPlans
  }

  const mergedPlans = [
    ...currentPlans,
    ...seedPlans.filter(
      (seedPlan) =>
        !currentPlans.some((currentPlan) => currentPlan.id === seedPlan.id)
    ),
  ].sort((left, right) => right.createdAt.localeCompare(left.createdAt))

  writeStoredProgramPlans(storageScopeId, mergedPlans)
  return mergedPlans
}

export function upsertStoredProgramPlan(
  storageScopeId: string,
  plan: StoredProgramPlan
) {
  const currentPlans = readStoredProgramPlans(storageScopeId)
  writeStoredProgramPlans(storageScopeId, [
    plan,
    ...currentPlans.filter((currentPlan) => currentPlan.id !== plan.id),
  ])
}

export function removeStoredProgramPlan(
  storageScopeId: string,
  planId: string
) {
  const currentPlans = readStoredProgramPlans(storageScopeId)
  const nextPlans = currentPlans.filter((plan) => plan.id !== planId)

  if (nextPlans.length === currentPlans.length) {
    return
  }

  writeStoredProgramPlans(storageScopeId, nextPlans)
}
