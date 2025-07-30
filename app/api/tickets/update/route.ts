import { sendTicketResponseEmail } from '@/lib/email';
import { updateTicket } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Updating ticket with data:', body);

    if (!body.ticketId || !body.analysis) {
      return NextResponse.json({ error: 'Missing ticketId or analysis' }, { status: 400 });
    }

    // Update ticket with AI analysis in MongoDB
    const updatedTicket = await updateTicket(body.ticketId, {
      status: 'resolved',
      sentiment: body.analysis.sentiment,
      intent: body.analysis.intent,
      ai_response: body.analysis.response,
    });

    console.log('Ticket updated successfully:', updatedTicket);

    // Send response email if email exists
    if (body.email && body.subject && body.analysis.response) {
      try {
        await sendTicketResponseEmail(body.email, `Re: ${body.subject}`, body.analysis.response);
        console.log('Response email sent successfully');
      } catch (emailError) {
        console.error('Failed to send response email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      updatedTicket,
      analysis: body.analysis,
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
