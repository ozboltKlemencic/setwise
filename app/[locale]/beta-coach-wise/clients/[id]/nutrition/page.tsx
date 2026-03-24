import ClientProfilePage, {
  type ClientProfileRouteProps,
} from "../client-profile-page"

export default async function Page(props: ClientProfileRouteProps) {
  return ClientProfilePage({ ...props, section: "nutrition" })
}
