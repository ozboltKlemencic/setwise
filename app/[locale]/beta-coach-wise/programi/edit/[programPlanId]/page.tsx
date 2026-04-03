import { ProgramBuilderEditPageView } from "@/components/coachWise/clients/programs/program-builder-edit-page-view"
import { routing } from "@/i18n/routing"
import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import { resolveProgramsEditorBackHref } from "@/lib/handlers/programs.handlers"

type Props = {
  params: Promise<{ locale: string; programPlanId: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, programPlanId } = await params
  const resolvedSearchParams = await searchParams

  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backHref = resolveProgramsEditorBackHref(
    getSingleSearchParam(resolvedSearchParams.backTo),
    `${localePrefix}/beta-coach-wise/programi`
  )

  return (
    <section className="min-w-0 m-0 bg-neutral-50 p-0">
      <ProgramBuilderEditPageView
        programPlanId={programPlanId}
        backHref={backHref}
      />
    </section>
  )
}
