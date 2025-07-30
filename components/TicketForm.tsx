'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle API error responses
        const errorMessage =
          result.error ||
          (result.details ? JSON.stringify(result.details) : 'Failed to submit ticket');
        throw new Error(errorMessage);
      }

      // Show ticket ID in success message
      toast.success(
        `Ticket submitted successfully! ${
          result.ticketId ? `(ID: ${result.ticketId.slice(-6)})` : ''
        }`,
        {
          description: 'Our AI will process your request shortly.',
        },
      );

      // Reset form
      setFormData({
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Submission error:', error);

      toast.error('Failed to submit ticket', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="pb-2 block text-sm font-medium" htmlFor="email">
          Email *
        </Label>
        <Input
          className="py-6"
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label className="pb-2 block text-sm font-medium" htmlFor="subject">
          Subject *
        </Label>
        <Input
          className="py-6"
          id="subject"
          placeholder="Brief description of your issue"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>

      <div>
        <Label className="pb-2 block text-sm font-medium" htmlFor="message">
          Message *
        </Label>
        <Textarea
          className="min-h-[200px]"
          id="message"
          placeholder="Please describe your issue in detail..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full py-6 text-md font-semibold" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Ticket
          </>
        )}
      </Button>
    </form>
  );
}
