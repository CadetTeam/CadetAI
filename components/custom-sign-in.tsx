"use client"

import { SignIn } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"

export function CustomSignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-gray-700 hover:bg-gray-800 text-white",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-gray-900 dark:text-white",
                headerSubtitle: "text-gray-600 dark:text-gray-300",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
                formFieldInput: "border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:focus:border-gray-400",
                footerActionLink: "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                identityPreviewText: "text-gray-600 dark:text-gray-300",
                formFieldLabel: "text-gray-700 dark:text-gray-300"
              }
            }}
            redirectUrl="/app"
          />
        </CardContent>
      </Card>
    </div>
  )
}
