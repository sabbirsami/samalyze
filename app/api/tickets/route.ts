import { sendTicketResponseEmail } from '@/lib/email';
import { createTicket } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating ticket with data:', body);

    if (!body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticketId = await createTicket({
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    console.log('Ticket created with ID:', ticketId);

    // Send confirmation email
    try {
      await sendTicketResponseEmail(
        body.email,
        `Ticket Received: ${body.subject}`,
        `We've received your ticket (#${ticketId.slice(-6)}). We'll respond soon.`,
      );
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // FIXED: Send correct data structure to n8n
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        console.log('Triggering n8n webhook:', process.env.N8N_WEBHOOK_URL);

        // CORRECT structure that matches your curl test
        const webhookPayload = {
          // Remove the outer 'body' wrapper
          ticketId: ticketId,
          email: body.email,
          subject: body.subject,
          message: body.message,
        };

        console.log('Sending webhook payload:', JSON.stringify(webhookPayload, null, 2));

        const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-App/1.0',
          },
          body: JSON.stringify(webhookPayload),
        });

        const responseText = await webhookResponse.text();
        console.log('n8n webhook response status:', webhookResponse.status);
        console.log('n8n webhook response:', responseText);

        if (!webhookResponse.ok) {
          console.error('n8n webhook failed:', {
            status: webhookResponse.status,
            statusText: webhookResponse.statusText,
            response: responseText,
          });
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
