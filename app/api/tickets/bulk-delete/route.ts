import { deleteMultipleTickets } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticketIds } = body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json({ error: 'Invalid ticket IDs provided' }, { status: 400 });
    }

    const result = await deleteMultipleTickets(ticketIds);

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} tickets deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error bulk deleting tickets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
