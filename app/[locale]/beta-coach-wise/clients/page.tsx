import { CoachWiseClientsTable } from "@/components/coach-wise-clients-table"

import data from "../data.json"

export default function ClientsPage() {
  return (
    <section>
      <CoachWiseClientsTable data={data} />
    </section>
  )
}
