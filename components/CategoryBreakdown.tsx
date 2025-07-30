'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Mock data - in real app, this would come from your database
const mockCategories = [
  { name: 'Food & Dining', amount: 456.75, budget: 500, color: 'bg-red-500' },
  { name: 'Transportation', amount: 234.5, budget: 300, color: 'bg-blue-500' },
  { name: 'Shopping', amount: 189.25, budget: 250, color: 'bg-purple-500' },
  { name: 'Entertainment', amount: 145.8, budget: 200, color: 'bg-yellow-500' },
  { name: 'Utilities', amount: 123.45, budget: 150, color: 'bg-green-500' },
  { name: 'Healthcare', amount: 67.9, budget: 100, color: 'bg-pink-500' },
];

export function CategoryBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCategories.map((category) => {
            const percentage = (category.amount / category.budget) * 100;
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    ${category.amount.toFixed(2)} / ${category.budget.toFixed(2)}
                  </span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>${(category.budget - category.amount).toFixed(2)} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
