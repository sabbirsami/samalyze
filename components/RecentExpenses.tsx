import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app, this would come from your database
const mockExpenses = [
  {
    id: '1',
    amount: 45.5,
    merchant: 'Whole Foods Market',
    category: 'food',
    description: 'Weekly groceries',
    date: '2025-07-30',
    aiConfidence: 0.95,
  },
  {
    id: '2',
    amount: 12.75,
    merchant: 'Starbucks',
    category: 'food',
    description: 'Morning coffee',
    date: '2025-07-30',
    aiConfidence: 0.98,
  },
  {
    id: '3',
    amount: 85.0,
    merchant: 'Shell Gas Station',
    category: 'transport',
    description: 'Gas fill-up',
    date: '2025-07-29',
    aiConfidence: 0.92,
  },
  {
    id: '4',
    amount: 29.99,
    merchant: 'Netflix',
    category: 'entertainment',
    description: 'Monthly subscription',
    date: '2025-07-28',
    aiConfidence: 0.99,
  },
  {
    id: '5',
    amount: 156.8,
    merchant: 'Target',
    category: 'shopping',
    description: 'Household items',
    date: '2025-07-27',
    aiConfidence: 0.87,
  },
];

const categoryColors = {
  food: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  shopping: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  utilities: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  entertainment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  healthcare: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export function RecentExpenses() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Expenses</CardTitle>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {expense.merchant.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{expense.merchant}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={categoryColors[expense.category as keyof typeof categoryColors]}
                    >
                      {expense.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${expense.amount.toFixed(2)}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
