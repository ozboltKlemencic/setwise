import { InfoPageContent } from "../_components/info-page-content"
import { resolveClientDetailContext, type ClientDetailParamsProps } from "../_lib/client-detail-page"

export default async function Page({ params }: ClientDetailParamsProps) {
  const { client, clientId, clientBasePath } = await resolveClientDetailContext(params)

  return (
    <InfoPageContent
      client={client}
      clientId={clientId}
      clientBasePath={clientBasePath}
    />
  )
}
