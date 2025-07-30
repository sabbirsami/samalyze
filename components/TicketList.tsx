import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTickets } from '@/lib/mongodb'; // Changed from supabase to mongodb
import { Ticket } from '@/lib/types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

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

export async function TicketList() {
  try {
    const tickets = await getTickets();

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tickets found</p>
            ) : (
              tickets.map((ticket: Ticket) => {
                const StatusIcon = statusIcons[ticket.status];
                return (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {ticket.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
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
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <p className="text-xs text-gray-400">ID: {ticket.id.slice(-6)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('Error loading tickets:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Unable to load tickets</p>
            <p className="text-xs">Please check your database connection</p>
            <p className="text-xs text-red-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}
