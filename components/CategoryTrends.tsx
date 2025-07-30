'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data for category trends
const mockTrendData = [
  { month: 'Jan', food: 456, transport: 234, shopping: 189, entertainment: 145 },
  { month: 'Feb', food: 478, transport: 267, shopping: 156, entertainment: 178 },
  { month: 'Mar', food: 423, transport: 198, shopping: 234, entertainment: 123 },
  { month: 'Apr', food: 567, transport: 289, shopping: 267, entertainment: 189 },
  { month: 'May', food: 445, transport: 234, shopping: 198, entertainment: 156 },
  { month: 'Jun', food: 489, transport: 256, shopping: 223, entertainment: 167 },
  { month: 'Jul', food: 456, transport: 234, shopping: 189, entertainment: 145 },
];

export function CategoryTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value: number) => `$${value}`} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="food"
                stroke="#ef4444"
                strokeWidth={2}
                name="Food & Dining"
              />
              <Line
                type="monotone"
                dataKey="transport"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Transportation"
              />
              <Line
                type="monotone"
                dataKey="shopping"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Shopping"
              />
              <Line
                type="monotone"
                dataKey="entertainment"
                stroke="#eab308"
                strokeWidth={2}
                name="Entertainment"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
