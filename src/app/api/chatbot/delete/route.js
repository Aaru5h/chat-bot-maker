import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function DELETE(request) {
  try {
    const { chatbotName, token } = await request.json();

    // Validate input
    if (!chatbotName || !token) {
      return NextResponse.json(
        { message: 'Chatbot name and token are required' },
        { status: 400 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get chatbots collection
    const chatbotsCollection = await getCollection('chatbots');
    
    // Find the chatbot to delete
    const chatbot = await chatbotsCollection.findOne({ name: chatbotName });
    
    if (!chatbot) {
      return NextResponse.json(
        { message: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Check if user owns this chatbot
    if (chatbot.creator !== decoded.email) {
      return NextResponse.json(
        { message: 'Unauthorized: You can only delete your own chatbots' },
        { status: 403 }
      );
    }

    // Delete the chatbot
    await chatbotsCollection.deleteOne({ name: chatbotName, creator: decoded.email });

    return NextResponse.json(
      { message: 'Chatbot deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete chatbot error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
