import RouteNotFoundView from "@/components/shared/fallback/RouteNotFoundView"

export default function CommonLayoutNotFound() {
  return (
    <RouteNotFoundView
      title="Requested content was not found"
      description="This content is unavailable right now. Try another section from the navigation menu."
    />
  )
}
