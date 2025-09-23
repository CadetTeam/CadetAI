"use client"

import { PricingTable } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionPage = () => {
  const hasClerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder');

  if (!hasClerkKey) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Subscription Plans</h1>
            <p className="text-muted-foreground">
              Choose the perfect plan for your organization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for small teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$29/month</div>
                <ul className="space-y-2 mb-6">
                  <li>Up to 5 team members</li>
                  <li>10 APD documents</li>
                  <li>Basic support</li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>Most popular choice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$99/month</div>
                <ul className="space-y-2 mb-6">
                  <li>Up to 25 team members</li>
                  <li>Unlimited APD documents</li>
                  <li>Priority support</li>
                  <li>Advanced analytics</li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$299/month</div>
                <ul className="space-y-2 mb-6">
                  <li>Unlimited team members</li>
                  <li>Unlimited APD documents</li>
                  <li>24/7 support</li>
                  <li>Custom integrations</li>
                  <li>Dedicated account manager</li>
                </ul>
                <Button className="w-full">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <PricingTable />
    </main>
  );
};

export default SubscriptionPage;
