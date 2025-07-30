import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTicketStats } from '@/lib/mongodb'; // Changed from supabase to mongodb
import { AlertCircle, BarChart3, CheckCircle, Clock } from 'lucide-react';
import { TicketList } from './TicketList';

export async function TicketStats() {
  try {
    const stats = await getTicketStats();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <p className="text-xs text-muted-foreground">Being analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Recent Tickets List */}
        <div className="mt-8">
          <TicketList />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading ticket stats:', error);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p>Unable to load stats</p>
              <p className="text-xs">Please check your database connection</p>
              <p className="text-xs text-red-500">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
