import { getCollection } from '@/lib/mongodb';

export async function GET(req) {
  try {
    // Get chatbots collection
    const chatbotsCollection = await getCollection('chatbots');
    
    // Get all chatbots (public endpoint for explore page)
    const chatbots = await chatbotsCollection.find({}).toArray();
    
    return new Response(JSON.stringify(chatbots), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Get all chatbots error:', err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
