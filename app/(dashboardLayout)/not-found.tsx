import RouteNotFoundView from "@/components/shared/fallback/RouteNotFoundView"

export default function DashboardLayoutNotFound() {
  return (
    <RouteNotFoundView
      title="Dashboard page not found"
      description="This dashboard section does not exist for your role, or the link is no longer active."
    />
  )
}
