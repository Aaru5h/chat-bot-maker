import { NextResponse } from 'next/server';
import { getData, putData, verifyToken } from '../../utils';
import dbAddress from '@/db';
import path from 'path';

const filePath = path.join(dbAddress, 'chatbots.json');

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

    // Verify token
    const isValidToken = await verifyToken(token);
    if (!isValidToken) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get current chatbots
    const chatbots = await getData(filePath);
    
    // Find the chatbot to delete
    const chatbotIndex = chatbots.findIndex(bot => bot.name === chatbotName);
    
    if (chatbotIndex === -1) {
      return NextResponse.json(
        { message: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Get user email from token (simple extraction from our token format)
    const userEmail = token.split('#@#')[1];
    
    // Check if user owns this chatbot
    if (chatbots[chatbotIndex].creator !== userEmail) {
      return NextResponse.json(
        { message: 'Unauthorized: You can only delete your own chatbots' },
        { status: 403 }
      );
    }

    // Remove the chatbot
    chatbots.splice(chatbotIndex, 1);
    
    // Save the updated data
    await putData(filePath, chatbots);

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