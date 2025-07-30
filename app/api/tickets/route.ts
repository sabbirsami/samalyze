import { sendTicketResponseEmail } from '@/lib/email';
import { createTicket } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create ticket
    const ticketId = await createTicket({
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    // Trigger n8n workflow (async)
    fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId,
        email: body.email,
        subject: body.subject,
        message: body.message,
      }),
    }).catch(console.error);

    // Send confirmation email (async)
    sendTicketResponseEmail(
      body.email,
      `Ticket Received: ${body.subject}`,
      `We've received your ticket (#${ticketId.slice(-6)}). We'll respond soon.`,
    ).catch(console.error);

    return NextResponse.json({ success: true, ticketId }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
