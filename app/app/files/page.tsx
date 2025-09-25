import { EmptyAppPage } from "@/components/empty-app-page"

export default function FilesPage() {
  return (
    <EmptyAppPage
      appName="Files"
      appId="files"
      description="Centralized file management and collaboration platform"
      features={[
        "Cloud storage integration",
        "File sharing and permissions",
        "Version control",
        "Document collaboration",
        "Advanced search",
        "Backup and recovery"
      ]}
    />
  )
}
