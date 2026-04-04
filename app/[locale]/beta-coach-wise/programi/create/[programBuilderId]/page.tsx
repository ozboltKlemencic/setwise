import { notFound } from "next/navigation"

import { ProgramBuilderPageView } from "@/components/coachWise/clients/programs/program-builder-page"
import { routing } from "@/i18n/routing"
import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import {
  programsCreateRouteId,
  resolveProgramsEditorBackHref,
} from "@/lib/handlers/programs.handlers"
import { getFixedPrograms } from "@/lib/programs/fixed-programs-data"
import { createProgramBuilderInitialProgram } from "@/lib/programs/program-builder.utils"

type Props = {
  params: Promise<{ locale: string; programBuilderId: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, programBuilderId } = await params
  const resolvedSearchParams = await searchParams

  if (programBuilderId !== programsCreateRouteId) {
    notFound()
  }

  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backHref = resolveProgramsEditorBackHref(
    getSingleSearchParam(resolvedSearchParams.backTo),
    `${localePrefix}/beta-coach-wise/programi`
  )
  const presetId = getSingleSearchParam(resolvedSearchParams.preset)
  const templateId = getSingleSearchParam(resolvedSearchParams.template)

  const initialProgram = createProgramBuilderInitialProgram(
    getFixedPrograms(),
    presetId
  )

  return (
    <section className="min-w-0 bg-neutral-50 p-0 m-0">
      <ProgramBuilderPageView
        initialProgram={initialProgram}
        backHref={backHref}
        initialTemplateId={templateId ?? undefined}
      />
    </section>
  )
}
