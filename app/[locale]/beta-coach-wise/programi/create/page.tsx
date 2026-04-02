import { redirect } from "next/navigation"

import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import {
  getProgramsCreateHref,
  resolveProgramsEditorBackHref,
} from "@/lib/handlers/programs.handlers"
import { routing } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backHref = resolveProgramsEditorBackHref(
    getSingleSearchParam(resolvedSearchParams.backTo),
    `${localePrefix}/beta-coach-wise/programi`
  )

  redirect(
    getProgramsCreateHref(
      backHref,
      getSingleSearchParam(resolvedSearchParams.preset)
    )
  )
}
