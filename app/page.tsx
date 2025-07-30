import { Suspense } from 'react';

import { ExpenseForm } from '@/components/ExpenseForm';
import { QuickStats } from '@/components/QuickStats';
import { RecentExpenses } from '@/components/RecentExpenses';
import { Header } from '@/components/shared/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className=" h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3  h-full ">
          {/* Left Column - Expense Entry */}

          <div className="lg:col-span-1 bg-muted border-e h-full min-h-screen py-10 px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Smart Expense Analyzer
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                AI-Powered Personal Finance Assistant
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
                <CardDescription>Upload a receipt or enter manually</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Recent */}
          <div className="lg:col-span-2 space-y-6  py-6 px-6">
            <Suspense fallback={<QuickStatsSkeleton />}>
              <QuickStats />
            </Suspense>

            <Suspense fallback={<RecentExpensesSkeleton />}>
              <RecentExpenses />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickStatsSkeleton() {
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

function RecentExpensesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
