import { ProgramPlanDetailView } from "@/components/coachWise/clients/programs/program-plan-detail-view"
import { routing } from "@/i18n/routing"
import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import { resolveProgramsEditorBackHref } from "@/lib/handlers/programs.handlers"

type Props = {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, id } = await params
  const resolvedSearchParams = await searchParams

  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backHref = resolveProgramsEditorBackHref(
    getSingleSearchParam(resolvedSearchParams.backTo),
    `${localePrefix}/beta-coach-wise/programi`
  )

  return (
    <section className="m-0 min-w-0 bg-neutral-50 p-0">
      <ProgramPlanDetailView programPlanId={id} backHref={backHref} />
    </section>
  )
}
