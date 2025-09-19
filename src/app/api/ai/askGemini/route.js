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
        
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
            // Provide a fallback response for demo purposes
            const demoResponses = [
                `Based on the context provided: "${context}", I can help you with questions related to this topic. However, I'm currently running in demo mode as the AI service needs to be configured with a valid API key.`,
                `I understand you're asking: "${text}". While I'd love to provide a detailed response based on my training context about "${context}", I need a valid Gemini API key to give you accurate answers.`,
                `Thank you for your question about "${text}". In a fully configured environment, I would use the context: "${context}" to provide you with a comprehensive answer. Please configure the GEMINI_API_KEY environment variable.`,
                `I see you're interested in "${text}". My knowledge is based on: "${context}". To provide you with AI-powered responses, please set up the Gemini API key in the environment variables.`
            ];
            
            const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
            
            return new Response(JSON.stringify({message: randomResponse, demo: true}), {
                status: 200,
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
        
        console.log('Raw Gemini response:', JSON.stringify(data, null, 2));
        
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                message = candidate.content.parts[0].text;
                console.log('Extracted message:', message);
            } else {
                console.log('No content parts found in candidate:', candidate);
            }
        } else {
            console.log('No candidates found in response:', data);
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









