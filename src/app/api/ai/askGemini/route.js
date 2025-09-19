import { createPrompt } from "../../helper";
export async function POST(req) {
    try{
        const{text,context} = await req.json();
        
        if (!text || !context) {
            return new Response(JSON.stringify({error: "Text and context are required"}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        
        const prompt = createPrompt({ context, text });

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({error: "AI service not configured", message: "I'm temporarily unavailable. Please try again later."}), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "contents": [{
                  "parts":[{"text": prompt}]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract the actual message from Gemini response
        let message = "I couldn't generate a response. Please try again.";
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            message = data.candidates[0].content.parts[0].text;
        }
        
        return new Response(JSON.stringify({message, success: true}), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
        
    } catch (error) {
        console.error('AI API error:', error);
        return new Response(JSON.stringify({
            error: "Internal Server Error",
            message: "I'm experiencing some technical difficulties. Please try again later."
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}









