import { EmptyAppPage } from "@/components/empty-app-page"

export default function AddPage() {
  return (
    <EmptyAppPage
      appName="Add New"
      appId="add"
      description="Create new applications and integrations for your platform"
      features={[
        "App template library",
        "Custom app builder",
        "Integration marketplace",
        "API connection tools",
        "Deployment automation",
        "Configuration management"
      ]}
    />
  )
}
