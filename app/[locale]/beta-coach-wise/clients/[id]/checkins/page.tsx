import {
  AssignedCheckinDetailView,
} from "@/components/coachWise/clients/client-checkins-panel"

import { CheckinsPageContent } from "../_components/checkins-page-content"
import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "../_lib/client-detail-page"

type CheckinsSearchParams = {
  assignedCheckin?: string | string[]
  checkinTab?: string | string[]
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<CheckinsSearchParams>) {
  const { client } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const assignedCheckinId = getSingleSearchParam(
    resolvedSearchParams.assignedCheckin
  )
  const activeCheckinTab = getSingleSearchParam(resolvedSearchParams.checkinTab)
  const resolvedCheckinTab =
    activeCheckinTab === "assigned" ? "assigned" : "submitted"

  if (assignedCheckinId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <AssignedCheckinDetailView checkinId={assignedCheckinId} />
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <CheckinsPageContent
        clientName={client.header}
        activeTab={resolvedCheckinTab}
      />
    </section>
  )
}
