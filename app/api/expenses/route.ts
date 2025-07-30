import { type NextRequest, NextResponse } from 'next/server';

// Mock database - in real app, use Supabase or your preferred database
const mockExpenses = [
  {
    id: '1',
    userEmail: 'user@example.com',
    amount: 45.5,
    merchant: 'Whole Foods Market',
    category: 'food',
    description: 'Weekly groceries',
    date: '2025-07-30',
    receiptUrl: null,
    createdAt: new Date().toISOString(),
  },
  // Add more mock data as needed
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail') || 'user@example.com';

    // Filter expenses by user email
    const userExpenses = mockExpenses.filter((expense) => expense.userEmail === userEmail);

    return NextResponse.json(userExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, merchant, category, description, date, userEmail = 'user@example.com' } = body;

    // Validate required fields
    if (!amount || !merchant || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, merchant, category' },
        { status: 400 },
      );
    }

    // Create new expense
    const newExpense = {
      id: Date.now().toString(),
      userEmail,
      amount: Number.parseFloat(amount),
      merchant,
      category,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      receiptUrl: null,
      createdAt: new Date().toISOString(),
    };

    // Add to mock database
    mockExpenses.push(newExpense);

    // In a real app, you would also trigger n8n workflow here
    // await triggerN8nWorkflow(newExpense)

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
