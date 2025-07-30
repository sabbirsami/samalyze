import { createClient } from '@supabase/supabase-js';
import type { Ticket } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// Database operations
export async function createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('tickets').insert([ticket]).select().single();

  if (error) throw error;
  return data as Ticket;
}

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Ticket[];
}

export async function updateTicket(id: string, updates: Partial<Ticket>) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Ticket;
}

export async function getTicketStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  resolved: number;
}> {
  const { data, error } = await supabase.from('tickets').select('status');

  if (error) throw error;

  const stats = {
    total: data.length,
    pending: data.filter((t) => t.status === 'pending').length,
    processing: data.filter((t) => t.status === 'processing').length,
    resolved: data.filter((t) => t.status === 'resolved').length,
  };

  return stats;
}
