"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ClerkAuthButtons() {
  return (
    <div className="space-x-4">
      <Link href="/auth-unified">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Sign In
        </Button>
      </Link>
      <Link href="/auth-unified">
        <Button size="lg" variant="outline">
          Get Started
        </Button>
      </Link>
    </div>
  );
}

function FallbackAuthButtons() {
  return (
    <div className="space-x-4">
      <Link href="/auth-unified">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Sign In
        </Button>
      </Link>
      <Link href="/auth-unified">
        <Button size="lg" variant="outline">
          Get Started
        </Button>
      </Link>
    </div>
  );
}

export default function Home() {
  const [hasClerkKey, setHasClerkKey] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  // Redirect logged-in users to /app
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/app');
    }
  }, [isLoaded, isSignedIn, router]);
  
  // Check if Clerk is available
  useEffect(() => {
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    setHasClerkKey(!!clerkKey && !clerkKey.includes('placeholder'));
  }, []);
  
  // Don't show landing page content if user is signed in
  if (isLoaded && isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo variant="full" size={120} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            CadetAI Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A secure, compliant platform delivering 6 modular &apos;apps&apos; aligned with government-mandated processes. 
            Designed for enterprise and government use with emphasis on collaboration, AI-driven automation, and dynamic visualizations.
          </p>
          {hasClerkKey ? <ClerkAuthButtons /> : <FallbackAuthButtons />}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>AI-Driven APD Generation</CardTitle>
              <CardDescription>
                Automatically generate Advanced Planning Documents with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Template-based generation for government standards like OMB A-130 with collaborative contributions and audited chats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Collaboration</CardTitle>
              <CardDescription>
                Work together seamlessly with real-time editing and conflict resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Supabase real-time channels for edits, version control with e-signature integration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Built for government and enterprise compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                FedRAMP Moderate, SOC 2 Type II, GDPR/CCPA compliance with zero-trust security model.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
