import { EmptyAppPage } from "@/components/empty-app-page"

export default function WindowsPage() {
  return (
    <EmptyAppPage
      appName="Windows"
      appId="windows"
      description="Window management and multi-tasking platform"
      features={[
        "Multi-window management",
        "Desktop organization",
        "Task switching",
        "Virtual desktops",
        "Window snapping",
        "Application launcher"
      ]}
    />
  )
}
