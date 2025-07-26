import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, question, answer, sessionId } = await request.json();

    // TODO: Replace this with actual Python backend integration
    // For now, returning a simulated response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulated response based on your IteratED system
    const responses = [
      "That's an interesting approach! Can you tell me more about how you arrived at that conclusion?",
      "I see you're thinking about this step by step. What would happen if we tried a different approach?",
      "You're on the right track! Let me ask you this: what do you think is the key concept here?",
      "Great thinking! Now, can you connect this to the main question we're working on?",
      "I like how you're breaking this down. What's the next logical step in your reasoning?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({
      success: true,
      message: randomResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 