import { sendTicketResponseEmail } from '@/lib/email';
import { updateTicket } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('n8n webhook received:', body);

    if (!body.ticketId || !body.analysis) {
      return NextResponse.json({ error: 'Missing ticketId or analysis' }, { status: 400 });
    }

    // Update ticket with AI analysis
    const updatedTicket = await updateTicket(body.ticketId, {
      status: 'resolved',
      sentiment: body.analysis.sentiment,
      intent: body.analysis.intent,
      ai_response: body.analysis.response,
    });

    // Send response email if email exists
    if (body.email && body.subject) {
      try {
        await sendTicketResponseEmail(body.email, `Re: ${body.subject}`, body.analysis.response);
      } catch (emailError) {
        console.error('Failed to send response email:', emailError);
      }
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error processing n8n webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
