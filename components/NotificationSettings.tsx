'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';

interface NotificationSettings {
  weeklyReports: boolean;
  budgetAlerts: boolean;
  unusualSpending: boolean;
  monthlyInsights: boolean;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    weeklyReports: true,
    budgetAlerts: true,
    unusualSpending: true,
    monthlyInsights: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast('Your notification preferences have been updated.');
    } catch (error) {
      toast('Failed to save notification settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-reports">Weekly Email Reports</Label>
            <p className="text-sm text-gray-500">Receive weekly spending summaries every Sunday</p>
          </div>
          <Switch
            id="weekly-reports"
            checked={settings.weeklyReports}
            onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="budget-alerts">Budget Alerts</Label>
            <p className="text-sm text-gray-500">Get notified when approaching budget limits</p>
          </div>
          <Switch
            id="budget-alerts"
            checked={settings.budgetAlerts}
            onCheckedChange={(checked) => updateSetting('budgetAlerts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="unusual-spending">Unusual Spending Alerts</Label>
            <p className="text-sm text-gray-500">AI-powered alerts for unusual spending patterns</p>
          </div>
          <Switch
            id="unusual-spending"
            checked={settings.unusualSpending}
            onCheckedChange={(checked) => updateSetting('unusualSpending', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="monthly-insights">Monthly Insights</Label>
            <p className="text-sm text-gray-500">Detailed monthly financial analysis and tips</p>
          </div>
          <Switch
            id="monthly-insights"
            checked={settings.monthlyInsights}
            onCheckedChange={(checked) => updateSetting('monthlyInsights', checked)}
          />
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
