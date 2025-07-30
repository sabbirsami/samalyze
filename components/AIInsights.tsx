import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Lightbulb, Target, TrendingUp } from 'lucide-react';

// Mock data - in real app, this would come from AI analysis
const mockInsights = [
  {
    id: '1',
    type: 'tip',
    title: 'Saving Opportunity',
    message: 'You spent 23% more on dining out this week. Consider meal prepping to save $45/week.',
    icon: Lightbulb,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: '2',
    type: 'trend',
    title: 'Spending Trend',
    message:
      'Your transportation costs have increased by 15% this month. Gas prices might be affecting your budget.',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Budget Alert',
    message:
      "You're approaching 90% of your food budget. Consider adjusting spending for the rest of the month.",
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    id: '4',
    type: 'goal',
    title: 'Goal Progress',
    message:
      "Great job! You're on track to save $200 this month by reducing entertainment expenses.",
    icon: Target,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
];

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="p-3 border rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="secondary" className={insight.color}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{insight.message}</p>
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
