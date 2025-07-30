import { Suspense } from 'react';

import { BudgetAnalysis } from '@/components/BudgetAnalysis';
import { CategoryTrends } from '@/components/CategoryTrends';
import { ExportData } from '@/components/ExportData';
import { Header } from '@/components/shared/Header';
import { SpendingHeatmap } from '@/components/SpendingHeatmap';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Deep insights into your spending patterns
            </p>
          </div>
          <ExportData />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Suspense fallback={<AnalyticsSkeleton />}>
              <SpendingHeatmap />
            </Suspense>

            <Suspense fallback={<AnalyticsSkeleton />}>
              <BudgetAnalysis />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<AnalyticsSkeleton />}>
              <CategoryTrends />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalyticsSkeleton() {
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
