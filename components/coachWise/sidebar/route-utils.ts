import { locales } from "@/i18n/routing"

function getLocalePrefix(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && locales.includes(firstSegment as (typeof locales)[number])) {
    return `/${firstSegment}`
  }

  return ""
}

export function normalizeCoachWisePathname(pathname: string) {
  const localePrefix = getLocalePrefix(pathname)

  if (!localePrefix) {
    return pathname || "/"
  }

  const strippedPathname = pathname.slice(localePrefix.length)
  return strippedPathname || "/"
}

export function buildCoachWiseHref(pathname: string, href: string) {
  if (!href.startsWith("/")) {
    return href
  }

  const localePrefix = getLocalePrefix(pathname)
  if (!localePrefix) {
    return href
  }

  if (href === "/") {
    return localePrefix
  }

  return `${localePrefix}${href}`
}
