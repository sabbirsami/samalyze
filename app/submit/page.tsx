import { Header } from '@/components/shared/Header';
import { TicketForm } from '@/components/TicketForm';
import { Card } from '@/components/ui/card';

export default function SubmitTicketPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Submit Support Ticket
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our AI will analyze and respond to your request
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="p-6">
              <TicketForm />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
