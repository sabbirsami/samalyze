'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

// Mock data for budget analysis
const mockBudgetData = [
  {
    category: 'Food & Dining',
    spent: 456.75,
    budget: 500,
    lastMonth: 478.5,
    color: 'bg-red-500',
  },
  {
    category: 'Transportation',
    spent: 234.5,
    budget: 300,
    lastMonth: 198.75,
    color: 'bg-blue-500',
  },
  {
    category: 'Shopping',
    spent: 189.25,
    budget: 250,
    lastMonth: 223.8,
    color: 'bg-purple-500',
  },
  {
    category: 'Entertainment',
    spent: 145.8,
    budget: 200,
    lastMonth: 167.9,
    color: 'bg-yellow-500',
  },
];

export function BudgetAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockBudgetData.map((item) => {
            const percentage = (item.spent / item.budget) * 100;
            const change = ((item.spent - item.lastMonth) / item.lastMonth) * 100;
            const isOverBudget = percentage > 100;
            const isIncreasing = change > 0;

            return (
              <div key={item.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isIncreasing ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : change < 0 ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-500" />
                    )}
                    <Badge variant={isOverBudget ? 'destructive' : 'secondary'}>
                      {Math.abs(change).toFixed(1)}% {isIncreasing ? '↑' : '↓'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>${item.spent.toFixed(2)} spent</span>
                    <span>${item.budget.toFixed(2)} budget</span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>
                      {isOverBudget
                        ? `$${(item.spent - item.budget).toFixed(2)} over budget`
                        : `$${(item.budget - item.spent).toFixed(2)} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
