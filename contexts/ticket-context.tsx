'use client';

import type { Ticket } from '@/lib/types';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface TicketContextType {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  removeTicket: (ticketId: string) => void;
  removeTickets: (ticketIds: string[]) => void;
  refreshTickets: () => Promise<void>;
  isRefreshing: boolean;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}

interface TicketProviderProps {
  children: ReactNode;
  initialTickets?: Ticket[];
}

export function TicketProvider({ children, initialTickets = [] }: TicketProviderProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const addTicket = useCallback((ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  }, []);

  const updateTicket = useCallback((ticketId: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updates } : ticket)),
    );
  }, []);

  const removeTicket = useCallback((ticketId: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  }, []);

  const removeTickets = useCallback((ticketIds: string[]) => {
    setTickets((prev) => prev.filter((ticket) => !ticketIds.includes(ticket.id)));
  }, []);

  const refreshTickets = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error refreshing tickets:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const value: TicketContextType = {
    tickets,
    setTickets,
    addTicket,
    updateTicket,
    removeTicket,
    removeTickets,
    refreshTickets,
    isRefreshing,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}
