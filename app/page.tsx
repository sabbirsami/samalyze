import { Header } from '@/components/shared/Header';
import { Suspense } from 'react';

import { TicketForm } from '@/components/TicketForm';
import { TicketStats } from '@/components/TicketStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Submission */}
          <div className="lg:col-span-1 space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                AI Support System
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get instant AI-powered support
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
                <CardDescription>Describe your issue and get AI assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <TicketForm />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<StatsSkeleton />}>
              <TicketStats />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
