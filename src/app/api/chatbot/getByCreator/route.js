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
    let decoded;
    try {
      decoded = jwt.verify(accessToken, JWT_SECRET);
    } catch (jwtError) {
      return new Response(JSON.stringify({ err: "Unauthorized - Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get chatbots collection
    const chatbotsCollection = await getCollection('chatbots');
    
    // Find chatbots by creator email
    const chatbots = await chatbotsCollection.find({ creator: decoded.email }).toArray();
    
    return new Response(JSON.stringify(chatbots), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Get chatbots by creator error:', err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
