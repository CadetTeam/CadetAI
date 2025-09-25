import { EmptyAppPage } from "@/components/empty-app-page"

export default function KeysPage() {
  return (
    <EmptyAppPage
      appName="Keys"
      appId="keys"
      description="API key management and access control system"
      features={[
        "API key generation",
        "Access level management",
        "Usage analytics",
        "Key rotation",
        "Integration monitoring",
        "Security policies"
      ]}
    />
  )
}
