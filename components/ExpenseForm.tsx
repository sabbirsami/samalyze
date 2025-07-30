'use client';

import type React from 'react';

type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'other';

interface ExpenseFormData {
  amount: string;
  merchant: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ReceiptUpload } from './ReceiptUpload';

const categories: { value: ExpenseCategory; label: string; color: string }[] = [
  { value: 'food', label: 'Food & Dining', color: 'bg-red-500' },
  { value: 'transport', label: 'Transportation', color: 'bg-blue-500' },
  { value: 'shopping', label: 'Shopping', color: 'bg-purple-500' },
  { value: 'utilities', label: 'Utilities', color: 'bg-green-500' },
  { value: 'entertainment', label: 'Entertainment', color: 'bg-yellow-500' },
  { value: 'healthcare', label: 'Healthcare', color: 'bg-pink-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' },
];

export function ExpenseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: '' as ExpenseCategory,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.merchant || !formData.category) {
      toast('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      });

      if (!response.ok) throw new Error('Failed to add expense');

      toast('Your expense has been successfully recorded.');

      // Reset form
      setFormData({
        amount: '',
        merchant: '',
        category: '' as ExpenseCategory,
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast('Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleReceiptProcessed = (data: any) => {
    setFormData({
      amount: data.amount?.toString() || '',
      merchant: data.merchant || '',
      category: data.category || '',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
    });
    toast('Expense details extracted successfully!');
  };

  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="receipt">Upload Receipt</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="merchant">Merchant *</Label>
            <Input
              id="merchant"
              placeholder="Store or restaurant name"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: ExpenseCategory) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional notes about this expense"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Expense...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </>
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="receipt">
        <Card>
          <CardContent className="p-6">
            <ReceiptUpload onProcessed={handleReceiptProcessed} />

            {/* Show extracted data if available */}
            {formData.amount && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  Extracted Information:
                </h4>
                <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <p>
                    <strong>Amount:</strong> ${formData.amount}
                  </p>
                  <p>
                    <strong>Merchant:</strong> {formData.merchant}
                  </p>
                  <p>
                    <strong>Category:</strong> {formData.category}
                  </p>
                  <p>
                    <strong>Date:</strong> {formData.date}
                  </p>
                  {formData.description && (
                    <p>
                      <strong>Description:</strong> {formData.description}
                    </p>
                  )}
                </div>
                <Button onClick={handleSubmit} className="mt-3 w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Expense...
                    </>
                  ) : (
                    'Confirm & Add Expense'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
