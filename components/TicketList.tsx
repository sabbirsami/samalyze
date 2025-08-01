'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { Ticket } from '@/lib/types';
import { AlertCircle, CheckCircle, Clock, Eye, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TicketDetailsModal } from './ui/TicketDetailsModal';

const statusIcons = {
  pending: Clock,
  processing: AlertCircle,
  resolved: CheckCircle,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

interface TicketListProps {
  initialTickets?: Ticket[];
}

export function TicketList({ initialTickets }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets || []);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialTickets);

  // Fetch tickets if no initial data provided
  useEffect(() => {
    if (!initialTickets) {
      fetchTickets();
    }
  }, [initialTickets]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        toast.error('Failed to load tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh tickets data
  const refreshTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error refreshing tickets:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(new Set(tickets.map((ticket) => ticket.id)));
    } else {
      setSelectedTickets(new Set());
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    const newSelected = new Set(selectedTickets);
    if (checked) {
      newSelected.add(ticketId);
    } else {
      newSelected.delete(ticketId);
    }
    setSelectedTickets(newSelected);
  };

  const handleViewDetails = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (response.ok) {
        const ticket = await response.json();
        setSelectedTicket(ticket);
        setIsModalOpen(true);
      } else {
        toast.error('Failed to load ticket details');
      }
    } catch (error) {
      console.error('Error loading ticket details:', error);
      toast.error('Failed to load ticket details');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Ticket deleted successfully');
        await refreshTickets();
        setSelectedTickets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(ticketId);
          return newSet;
        });
      } else {
        toast.error('Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTickets.size === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/tickets/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketIds: Array.from(selectedTickets),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.deletedCount} tickets deleted successfully`);
        await refreshTickets();
        setSelectedTickets(new Set());
      } else {
        toast.error('Failed to delete tickets');
      }
    } catch (error) {
      console.error('Error bulk deleting tickets:', error);
      toast.error('Failed to delete tickets');
    } finally {
      setIsDeleting(false);
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const isAllSelected = tickets.length > 0 && selectedTickets.size === tickets.length;
  const isIndeterminate = selectedTickets.size > 0 && selectedTickets.size < tickets.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Tickets</CardTitle>
            {selectedTickets.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedTickets.size} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tickets found</p>
            ) : (
              <>
                {/* Select All Checkbox */}
                <div className="flex items-center space-x-2 pb-2 border-b">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(ref) => {
                      if (ref) {
                        (ref as HTMLInputElement).indeterminate = isIndeterminate;
                      }
                    }}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All ({tickets.length} tickets)
                  </label>
                </div>

                {/* Ticket List */}
                {tickets.map((ticket: Ticket) => {
                  const StatusIcon = statusIcons[ticket.status];
                  const isSelected = selectedTickets.has(ticket.id);

                  return (
                    <div
                      key={ticket.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        isSelected ? 'bg-muted/50 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectTicket(ticket.id, checked as boolean)
                          }
                        />
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                          {ticket.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {ticket.subject}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={statusColors[ticket.status]}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {ticket.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{ticket.email}</span>
                          </div>
                          {ticket.sentiment && (
                            <Badge variant="outline" className="mt-1">
                              {ticket.sentiment} • {ticket.intent}
                            </Badge>
                          )}
                          {ticket.ai_response && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                              AI Response: {ticket.ai_response}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          <p className="text-xs text-gray-400">ID: {ticket.id.slice(-6)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(ticket.id)}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setTicketToDelete(ticket.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
      />

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ticketToDelete && handleDeleteTicket(ticketToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Tickets</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTickets.size} selected tickets? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedTickets.size} Tickets
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
