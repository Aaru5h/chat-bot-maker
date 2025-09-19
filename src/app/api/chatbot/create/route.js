import jwt from 'jsonwebtoken';
import { getCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return new Response(JSON.stringify({ err: "Unauthorized - No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, JWT_SECRET);
    } catch (jwtError) {
      return new Response(JSON.stringify({ err: "Unauthorized - Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, context } = await req.json();
    
    // Validation
    if (!name || !context) {
      return new Response(JSON.stringify({ err: "Name and context are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get chatbots collection
    const chatbotsCollection = await getCollection('chatbots');
    
    // Create new chatbot
    const newChatbot = {
      name,
      context,
      creator: decoded.email,
      createdAt: new Date()
    };

    await chatbotsCollection.insertOne(newChatbot);
    
    return new Response(
      JSON.stringify({ message: "Chatbot created successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error('Create chatbot error:', err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
