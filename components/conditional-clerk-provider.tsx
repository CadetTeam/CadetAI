"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

interface ConditionalClerkProviderProps {
  children: ReactNode
}

export function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If no Clerk key is provided, render children without Clerk
  if (!publishableKey || publishableKey.includes('placeholder')) {
    return <>{children}</>
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/app"
      appearance={{
        baseTheme: undefined,
        elements: {
          // Remove Clerk branding
          logoBox: "hidden",
          logoImage: "hidden",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          footer: "hidden",
          footerAction: "hidden",
          footerActionText: "hidden",
          footerActionLink: "hidden",
          // Style remaining elements
          socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
          formButtonPrimary: "bg-gray-700 hover:bg-gray-800 text-white",
          card: "bg-transparent shadow-none border-none",
          formFieldInput: "border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:focus:border-gray-400",
          identityPreviewText: "text-gray-600 dark:text-gray-300",
          formFieldLabel: "text-gray-700 dark:text-gray-300"
        },
        variables: {
          colorPrimary: "#374151", // gray-700
          colorBackground: "transparent",
          colorInputBackground: "transparent",
          colorInputText: "#111827", // gray-900
          borderRadius: "0.5rem"
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
