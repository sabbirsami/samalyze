import { sendTicketResponseEmail } from '@/lib/email';
import { createTicket } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating ticket with data:', body);

    // Basic validation
    if (!body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create ticket in MongoDB
    const ticketId = await createTicket({
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    console.log('Ticket created with ID:', ticketId);

    // Send confirmation email first (sync to ensure it works)
    try {
      await sendTicketResponseEmail(
        body.email,
        `Ticket Received: ${body.subject}`,
        `We've received your ticket (#${ticketId.slice(-6)}). We'll respond soon.`,
      );
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue even if confirmation email fails
    }

    // Trigger n8n workflow - Fixed webhook URL structure
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        console.log('Triggering n8n webhook:', process.env.N8N_WEBHOOK_URL);

        const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-App/1.0',
          },
          body: JSON.stringify({
            ticketId,
            email: body.email,
            subject: body.subject,
            message: body.message,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.error('n8n webhook failed:', errorText);
        } else {
          console.log('n8n webhook triggered successfully');
        }
      } catch (webhookError) {
        console.error('Error triggering n8n webhook:', webhookError);
      }
    } else {
      console.warn('N8N_WEBHOOK_URL not configured');
    }

    return NextResponse.json({ success: true, ticketId }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
