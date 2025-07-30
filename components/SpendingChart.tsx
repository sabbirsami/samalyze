'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data - in real app, this would come from your database
const mockData = [
  { date: '2025-07-01', amount: 45.5 },
  { date: '2025-07-02', amount: 23.75 },
  { date: '2025-07-03', amount: 67.2 },
  { date: '2025-07-04', amount: 12.3 },
  { date: '2025-07-05', amount: 89.45 },
  { date: '2025-07-06', amount: 34.6 },
  { date: '2025-07-07', amount: 56.8 },
  { date: '2025-07-08', amount: 78.9 },
  { date: '2025-07-09', amount: 23.45 },
  { date: '2025-07-10', amount: 45.67 },
  { date: '2025-07-11', amount: 67.89 },
  { date: '2025-07-12', amount: 34.56 },
  { date: '2025-07-13', amount: 78.9 },
  { date: '2025-07-14', amount: 45.67 },
];

export function SpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
