import { sendTicketResponseEmail } from '@/lib/email';
import { updateTicket } from '@/lib/supabase';
import type { TicketAnalysis } from '@/lib/types';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Optimize for Vercel's free tier

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimit = await checkRateLimit(request);
    if (rateLimit.isRateLimited) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: rateLimit.retryAfter,
        }),
        { status: 429 },
      );
    }

    const body = await request.json();
    const { ticketId, message, email, subject } = body;

    if (!ticketId || !message) {
      return NextResponse.json({ error: 'Missing ticketId or message' }, { status: 400 });
    }

    // Update ticket status to processing
    await updateTicket(ticketId, { status: 'processing' });

    // Analyze with Gemini API (optimized prompt)
    const analysis = await analyzeWithGemini(message);

    // Update ticket with AI analysis
    const updatedTicket = await updateTicket(ticketId, {
      status: 'resolved',
      sentiment: analysis.sentiment,
      intent: analysis.intent,
      ai_response: analysis.response,
    });

    // Send email response if email provided (async)
    if (email && subject && process.env.GMAIL_USER) {
      try {
        await sendTicketResponseEmail(email, subject, analysis.response);
      } catch (emailError) {
        console.error('Email failed (non-critical):', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error analyzing ticket:', error);

    // Update ticket status to pending if analysis fails
    if (request.body) {
      try {
        const { ticketId } = await request.clone().json();
        await updateTicket(ticketId, { status: 'pending' });
      } catch (parseError) {
        console.error('Error updating failed ticket:', parseError);
      }
    }

    return NextResponse.json({ error: 'Failed to analyze ticket' }, { status: 500 });
  }
}

// Optimized Gemini analysis function
async function analyzeWithGemini(message: string): Promise<TicketAnalysis> {
  // Truncate message to save tokens
  const truncatedMsg = message.substring(0, 500);

  const prompt = `Analyze support ticket:
Message: "${truncatedMsg}"

Respond in this exact JSON format only:
{
  "sentiment":"pos|neg|neu",
  "intent":"question|complaint|compliment|other",
  "response":"[50-100 word response]"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300, // Reduced for free tier
        },
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const result = JSON.parse(jsonMatch[0]);

    // Normalize response
    return {
      sentiment: normalizeSentiment(result.sentiment),
      intent: normalizeIntent(result.intent),
      response: result.response || 'Thank you for your message. We will respond soon.',
    };
  } catch (parseError) {
    console.error('Error parsing Gemini response:', parseError);
    return {
      sentiment: 'neutral',
      intent: 'other',
      response:
        'Thank you for contacting us. We have received your message and will get back to you soon.',
    };
  }
}

// Helper functions
function normalizeSentiment(sentiment?: string): 'positive' | 'negative' | 'neutral' {
  if (!sentiment) return 'neutral';
  const lower = sentiment.toLowerCase();
  if (lower.startsWith('pos')) return 'positive';
  if (lower.startsWith('neg')) return 'negative';
  return 'neutral';
}

function normalizeIntent(intent?: string): 'question' | 'complaint' | 'compliment' | 'other' {
  if (!intent) return 'other';
  const lower = intent.toLowerCase();
  if (lower.includes('question')) return 'question';
  if (lower.includes('complaint')) return 'complaint';
  if (lower.includes('compliment')) return 'compliment';
  return 'other';
}

// Simple rate limiting for free tier
async function checkRateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const key = `rate-limit:${ip}`;

  // In production, use Redis or similar
  const current = Number(await getCurrentCount(key));
  const limit = 15; // Gemini's free tier limit
  const windowMs = 60 * 1000; // 1 minute

  if (current >= limit) {
    return {
      isRateLimited: true,
      retryAfter: Math.ceil((windowMs - (Date.now() - current)) / 1000),
    };
  }

  await incrementCount(key, windowMs);
  return { isRateLimited: false, retryAfter: 0 };
}

// Mock rate limit storage - replace with real storage in production
const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

async function getCurrentCount(key: string): Promise<number> {
  const entry = rateLimitStore.get(key);
  if (!entry || entry.expiresAt < Date.now()) return 0;
  return entry.count;
}

async function incrementCount(key: string, windowMs: number): Promise<void> {
  const current = await getCurrentCount(key);
  rateLimitStore.set(key, {
    count: current + 1,
    expiresAt: Date.now() + windowMs,
  });
}
