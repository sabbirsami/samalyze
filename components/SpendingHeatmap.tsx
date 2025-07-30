'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for spending heatmap
const mockHeatmapData = [
  { day: 'Mon', week1: 45, week2: 67, week3: 23, week4: 89 },
  { day: 'Tue', week1: 23, week2: 45, week3: 67, week4: 34 },
  { day: 'Wed', week1: 67, week2: 89, week3: 45, week4: 56 },
  { day: 'Thu', week1: 34, week2: 23, week3: 78, week4: 67 },
  { day: 'Fri', week1: 89, week2: 56, week3: 34, week4: 45 },
  { day: 'Sat', week1: 56, week2: 78, week3: 89, week4: 78 },
  { day: 'Sun', week1: 78, week2: 34, week3: 56, week4: 23 },
];

const getIntensity = (value: number) => {
  if (value < 30) return 'bg-green-100 dark:bg-green-900';
  if (value < 50) return 'bg-yellow-100 dark:bg-yellow-900';
  if (value < 70) return 'bg-orange-100 dark:bg-orange-900';
  return 'bg-red-100 dark:bg-red-900';
};

export function SpendingHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1 text-xs text-center text-gray-500 mb-2">
            <div></div>
            <div>Week 1</div>
            <div>Week 2</div>
            <div>Week 3</div>
            <div>Week 4</div>
          </div>

          {mockHeatmapData.map((row) => (
            <div key={row.day} className="grid grid-cols-5 gap-1">
              <div className="text-xs text-gray-500 py-2 pr-2 text-right">{row.day}</div>
              <div
                className={`h-8 rounded ${getIntensity(
                  row.week1,
                )} flex items-center justify-center text-xs font-medium`}
              >
                ${row.week1}
              </div>
              <div
                className={`h-8 rounded ${getIntensity(
                  row.week2,
                )} flex items-center justify-center text-xs font-medium`}
              >
                ${row.week2}
              </div>
              <div
                className={`h-8 rounded ${getIntensity(
                  row.week3,
                )} flex items-center justify-center text-xs font-medium`}
              >
                ${row.week3}
              </div>
              <div
                className={`h-8 rounded ${getIntensity(
                  row.week4,
                )} flex items-center justify-center text-xs font-medium`}
              >
                ${row.week4}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Less spending</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900"></div>
              <div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900"></div>
              <div className="w-3 h-3 rounded bg-orange-100 dark:bg-orange-900"></div>
              <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900"></div>
            </div>
            <span>More spending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
