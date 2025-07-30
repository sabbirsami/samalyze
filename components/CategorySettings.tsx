'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const categories = [
  { name: 'Food & Dining', color: 'bg-red-500', count: 45 },
  { name: 'Transportation', color: 'bg-blue-500', count: 23 },
  { name: 'Shopping', color: 'bg-purple-500', count: 34 },
  { name: 'Utilities', color: 'bg-green-500', count: 12 },
  { name: 'Entertainment', color: 'bg-yellow-500', count: 18 },
  { name: 'Healthcare', color: 'bg-pink-500', count: 8 },
  { name: 'Other', color: 'bg-gray-500', count: 15 },
];

export function CategorySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${category.color}`} />
                <span className="font-medium">{category.name}</span>
              </div>
              <Badge variant="secondary">{category.count} expenses</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
