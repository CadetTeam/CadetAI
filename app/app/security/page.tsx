import { EmptyAppPage } from "@/components/empty-app-page"

export default function SecurityPage() {
  return (
    <EmptyAppPage
      appName="Security"
      appId="security"
      description="Advanced security management and monitoring for your organization"
      features={[
        "Real-time threat monitoring",
        "Access control management", 
        "Security audit logs",
        "Compliance reporting",
        "Identity verification",
        "Data encryption tools"
      ]}
    />
  )
}
