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
              baseTheme: undefined,
              elements: {
                // Remove all Clerk branding
                logoBox: "hidden",
                logoImage: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                footer: "hidden",
                footerAction: "hidden",
                footerActionText: "hidden",
                footerActionLink: "hidden",
                // Style remaining elements
                formButtonPrimary: "bg-gray-700 hover:bg-gray-800 text-white",
                card: "bg-transparent shadow-none border-none",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
                formFieldInput: "border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:focus:border-gray-400",
                identityPreviewText: "text-gray-600 dark:text-gray-300",
                formFieldLabel: "text-gray-700 dark:text-gray-300",
                formFieldSuccessText: "text-gray-600 dark:text-gray-300",
                formFieldErrorText: "text-red-600 dark:text-red-400",
                formFieldWarningText: "text-yellow-600 dark:text-yellow-400",
                formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                formFieldInputShowPasswordIcon: "text-gray-500 dark:text-gray-400",
                formFieldInputHidePasswordIcon: "text-gray-500 dark:text-gray-400",
                formFieldSuccessIcon: "text-gray-600 dark:text-gray-300",
                formFieldErrorIcon: "text-red-600 dark:text-red-400",
                formFieldWarningIcon: "text-yellow-600 dark:text-yellow-400"
              },
              variables: {
                colorPrimary: "#374151", // gray-700
                colorBackground: "transparent",
                colorInputBackground: "transparent",
                colorInputText: "#111827", // gray-900
                borderRadius: "0.5rem"
              }
            }}
            redirectUrl="/app"
          />
        </CardContent>
      </Card>
    </div>
  )
}
