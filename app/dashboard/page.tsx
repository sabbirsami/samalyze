import { AIInsights } from '@/components/AIInsights';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { MonthlyComparison } from '@/components/MonthlyComparison';
import { Header } from '@/components/shared/Header';
import { SpendingChart } from '@/components/SpendingChart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Expense Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your spending insights and analytics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<ChartSkeleton />}>
              <SpendingChart />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
              <MonthlyComparison />
            </Suspense>
          </div>

          {/* Right Column - Breakdown and Insights */}
          <div className="space-y-6">
            <Suspense fallback={<CategorySkeleton />}>
              <CategoryBreakdown />
            </Suspense>

            <Suspense fallback={<InsightsSkeleton />}>
              <AIInsights />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function CategorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
