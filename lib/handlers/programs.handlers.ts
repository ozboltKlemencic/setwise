export const programsCreateRouteId = "fixed-program"

export function getClientProgramBuilderHref(
  clientBasePath: string,
  options?: {
    backTo?: string
    presetId?: string
    templateId?: string
  }
) {
  return getProgramsCreateHref(
    options?.backTo,
    options?.presetId,
    options?.templateId
  )
}

export function getClientProgramEditorHref(
  clientBasePath: string,
  programPlanId: string,
  options?: {
    backTo?: string
  }
) {
  return getProgramsEditHref(
    programPlanId,
    options?.backTo ?? `${clientBasePath}/programs?programTab=calendar`
  )
}

export function getClientProgramDetailHref(
  clientBasePath: string,
  programPlanId: string,
  options?: {
    backTo?: string
  }
) {
  return getProgramsDetailHref(
    programPlanId,
    options?.backTo ?? `${clientBasePath}/programs?programTab=calendar`
  )
}

export function getProgramsCreateHref(
  backTo?: string,
  presetId?: string,
  templateId?: string
) {
  const params = new URLSearchParams()

  if (backTo) {
    params.set("backTo", backTo)
  }

  if (presetId) {
    params.set("preset", presetId)
  }

  if (templateId) {
    params.set("template", templateId)
  }

  const query = params.toString()

  return `/beta-coach-wise/programi/create/${programsCreateRouteId}${query ? `?${query}` : ""}`
}

export function getProgramsDetailHref(programPlanId: string, backTo?: string) {
  const params = new URLSearchParams()

  if (backTo) {
    params.set("backTo", backTo)
  }

  const query = params.toString()

  return `/beta-coach-wise/programi/${encodeURIComponent(programPlanId)}${query ? `?${query}` : ""}`
}

export function getProgramsEditHref(programPlanId: string, backTo?: string) {
  const params = new URLSearchParams()

  if (backTo) {
    params.set("backTo", backTo)
  }

  const query = params.toString()

  return `/beta-coach-wise/programi/edit/${encodeURIComponent(programPlanId)}${query ? `?${query}` : ""}`
}

export function resolveProgramsEditorBackHref(
  backTo: string | undefined,
  fallbackHref = "/beta-coach-wise/programi"
) {
  if (!backTo || !backTo.startsWith("/")) {
    return fallbackHref
  }

  return backTo
}

export function isGlobalProgramsBuilderBackHref(backHref?: string) {
  if (!backHref) {
    return false
  }

  const [pathname = ""] = backHref.split("?")

  return (
    /\/beta-coach-wise\/programi(?:\/|$)/.test(pathname) &&
    !/\/beta-coach-wise\/clients\/[^/]+\/programs(?:\/|$)/.test(pathname)
  )
}
