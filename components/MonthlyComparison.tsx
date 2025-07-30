'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data - in real app, this would come from your database
const mockData = [
  { month: 'Jan', amount: 1234.56 },
  { month: 'Feb', amount: 1456.78 },
  { month: 'Mar', amount: 1123.45 },
  { month: 'Apr', amount: 1567.89 },
  { month: 'May', amount: 1345.67 },
  { month: 'Jun', amount: 1234.56 },
  { month: 'Jul', amount: 1247.5 },
];

export function MonthlyComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
