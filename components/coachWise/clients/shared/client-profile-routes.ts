import { routing } from "@/i18n/routing"

export type ClientProfileSection =
  | "info"
  | "habbits"
  | "checkins"
  | "nutrition"
  | "supplements"
  | "programs"

function getLocalePrefix(locale: string) {
  return locale === routing.defaultLocale ? "" : `/${locale}`
}

export function getClientProfileBasePath(
  locale: string,
  clientId: number | string
) {
  return `${getLocalePrefix(locale)}/beta-coach-wise/clients/${clientId}`
}

export function getClientProfileSectionHref(
  locale: string,
  clientId: number | string,
  section: ClientProfileSection
) {
  return `${getClientProfileBasePath(locale, clientId)}/${section}`
}
