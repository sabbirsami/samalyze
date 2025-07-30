'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface BudgetCategories {
  food: number;
  transport: number;
  shopping: number;
  utilities: number;
  entertainment: number;
  healthcare: number;
  other: number;
}

const defaultBudgets: BudgetCategories = {
  food: 500,
  transport: 300,
  shopping: 250,
  utilities: 150,
  entertainment: 200,
  healthcare: 100,
  other: 100,
};

export function BudgetSettings() {
  const [budgets, setBudgets] = useState<BudgetCategories>(defaultBudgets);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast('Your budget limits have been updated successfully.');
    } catch (error) {
      toast('Failed to save budget settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBudget = (category: keyof BudgetCategories, value: string) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: Number.parseFloat(value) || 0,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(budgets).map(([category, value]) => (
            <div key={category}>
              <Label htmlFor={`${category}-budget`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Label>
              <Input
                id={`${category}-budget`}
                type="number"
                value={value}
                onChange={(e) => updateBudget(category as keyof BudgetCategories, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Budget Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
