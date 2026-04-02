import { redirect } from "next/navigation"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "@/lib/handlers/client-detail.handlers"
import { getProgramsCreateHref } from "@/lib/handlers/programs.handlers"

type ProgramsCreateSearchParams = {
  backTo?: string | string[]
  preset?: string | string[]
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<ProgramsCreateSearchParams>) {
  const { clientBasePath } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const backHref =
    getSingleSearchParam(resolvedSearchParams.backTo) ??
    `${clientBasePath}/programs?programTab=calendar`

  redirect(
    getProgramsCreateHref(
      backHref,
      getSingleSearchParam(resolvedSearchParams.preset)
    )
  )
}
