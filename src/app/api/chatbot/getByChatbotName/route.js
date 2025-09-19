import jwt from 'jsonwebtoken';
import { getCollection } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req) {
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
    try {
      jwt.verify(accessToken, JWT_SECRET);
    } catch (jwtError) {
      return new Response(JSON.stringify({ err: "Unauthorized - Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return new Response(JSON.stringify({ err: "Name query param missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get chatbots collection
    const chatbotsCollection = await getCollection('chatbots');
    
    // Find chatbot by name
    const chatbot = await chatbotsCollection.findOne({ name });
    
    if (!chatbot) {
      return new Response(JSON.stringify({ err: "Chatbot not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(chatbot), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Get chatbot by name error:', err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
