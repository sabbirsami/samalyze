import { sendTicketResponseEmail } from '@/lib/email';
import { createTicket } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Ticket submission received:', body);

    // Validate required fields
    if (!body.email || !body.subject || !body.message) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: {
            email: !body.email ? 'Email is required' : undefined,
            subject: !body.subject ? 'Subject is required' : undefined,
            message: !body.message ? 'Message is required' : undefined,
          },
        },
        { status: 400 },
      );
    }

    // Create ticket in database
    const ticket = await createTicket({
      email: body.email,
      subject: body.subject,
      message: body.message,
      status: 'pending',
      sentiment: null,
      intent: null,
      ai_response: null,
    });

    console.log('Ticket created:', ticket.id);

    // Trigger AI analysis (async)
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: ticket.id,
            email: ticket.email,
            subject: ticket.subject,
            message: ticket.message,
          }),
        });
      }
    } catch (webhookError) {
      console.error('Failed to trigger n8n webhook:', webhookError);
    }

    // Send confirmation email (async)
    try {
      await sendTicketResponseEmail(
        body.email,
        `Ticket Received: ${body.subject}`,
        `We've received your support ticket (#${ticket.id.slice(
          0,
          8,
        )}) and will respond shortly.\n\nSubject: ${
          body.subject
        }\nMessage: ${body.message.substring(0, 200)}${body.message.length > 200 ? '...' : ''}`,
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
