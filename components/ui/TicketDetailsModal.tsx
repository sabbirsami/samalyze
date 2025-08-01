'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Ticket } from '@/lib/types';
import { AlertCircle, CheckCircle, Clock, Mail, MessageSquare, User } from 'lucide-react';

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

const sentimentColors = {
  positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketDetailsModal({ ticket, isOpen, onClose }: TicketDetailsModalProps) {
  if (!ticket) return null;

  const StatusIcon = statusIcons[ticket.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ticket Details
          </DialogTitle>
          <DialogDescription>Ticket ID: {ticket.id.slice(-8)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <Badge className={statusColors[ticket.status]}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(ticket.created_at).toLocaleString()}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{ticket.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Subject */}
          <div className="space-y-2">
            <h3 className="font-semibold">Subject</h3>
            <p className="text-lg">{ticket.subject}</p>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-2">
            <h3 className="font-semibold">Message</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{ticket.message}</p>
            </div>
          </div>

          {/* AI Analysis */}
          {(ticket.sentiment || ticket.intent) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">AI Analysis</h3>
                <div className="flex gap-2">
                  {ticket.sentiment && (
                    <Badge
                      className={sentimentColors[ticket.sentiment as keyof typeof sentimentColors]}
                    >
                      Sentiment: {ticket.sentiment}
                    </Badge>
                  )}
                  {ticket.intent && <Badge variant="outline">Intent: {ticket.intent}</Badge>}
                </div>
              </div>
            </>
          )}

          {/* AI Response */}
          {ticket.ai_response && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">AI Response</h3>
                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p>{ticket.ai_response}</p>
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>
              <br />
              {new Date(ticket.created_at).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <br />
              {new Date(ticket.updated_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
