import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/app-layout";
import { ConditionalClerkProvider } from "@/components/conditional-clerk-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CadetAI Platform",
  description: "A secure, compliant platform delivering 6 modular 'apps' aligned with government-mandated processes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AppLayout>
              {children}
            </AppLayout>
          </ThemeProvider>
        </ConditionalClerkProvider>
      </body>
    </html>
  );
}
