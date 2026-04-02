import RouteNotFoundView from "@/components/shared/fallback/RouteNotFoundView"

export default function NotFound() {
  return (
    <RouteNotFoundView
      title="This page could not be found"
      description="The address may be incorrect, or the page was moved. Please use navigation links to continue safely."
    />
  )
}
