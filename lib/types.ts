export interface Ticket {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved';
  sentiment: 'positive' | 'negative' | 'neutral' | null;
  intent: 'question' | 'complaint' | 'compliment' | 'other' | null;
  ai_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  intent: 'question' | 'complaint' | 'compliment' | 'other';
  response: string;
}

export interface TicketStats {
  total: number;
  pending: number;
  processing: number;
  resolved: number;
}
export interface Expense {
  id: string;
  userEmail: string;
  amount: number;
  merchant: string;
  category: string;
  description?: string;
  date: string; // ISO date string
  receiptUrl?: string | null;
  createdAt: string; // ISO date string
}
