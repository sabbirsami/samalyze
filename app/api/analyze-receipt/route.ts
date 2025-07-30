import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // In a real app, you would integrate with Gemini Vision API here
    // For now, we'll simulate the AI processing with mock data

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock AI response - in real app, this would come from Gemini Vision API
    const mockAnalysis = {
      amount: Math.floor(Math.random() * 100) + 10, // Random amount between 10-110
      merchant: ['Starbucks', "McDonald's", 'Target', 'Walmart', 'Shell Gas Station'][
        Math.floor(Math.random() * 5)
      ],
      date: new Date().toISOString().split('T')[0],
      category: ['food', 'transport', 'shopping', 'utilities', 'entertainment'][
        Math.floor(Math.random() * 5)
      ],
      description: 'Receipt processed by AI',
      confidence: 0.95,
    };

    return NextResponse.json(mockAnalysis);
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    return NextResponse.json({ error: 'Failed to analyze receipt' }, { status: 500 });
  }
}

// Example of how you would integrate with Gemini Vision API:
/*
async function analyzeReceiptWithGemini(imageBase64: string) {
  const prompt = `
    Analyze this receipt image and extract the following information:
    1. Total amount (number only)
    2. Merchant/store name
    3. Date (YYYY-MM-DD format)
    4. Category (food, transport, shopping, utilities, entertainment, healthcare, other)
    5. Brief description of items

    Format the response as JSON:
    {
      "amount": 25.50,
      "merchant": "Starbucks",
      "date": "2025-07-30",
      "category": "food",
      "description": "Coffee and pastry"
    }
  `

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: imageBase64.split(',')[1] } }
        ]
      }]
    })
  })

  const result = await response.json()
  return JSON.parse(result.candidates[0].content.parts[0].text)
}
*/
