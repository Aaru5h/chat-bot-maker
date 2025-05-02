import { createPrompt } from "../../helper";
export async function POST(req) {
    try{
        const{text,context} = await req.json();
        const prompt = createPrompt({ context, text });
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBsNX_GbrY6U_41Y3ucl5VNdwZxS1iSNUQ`, {
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
        const data = await response.json();
        return new Response(JSON.stringify({response:data}), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
        
    }catch (error) {
        console.log(error)
        return new Response(JSON.stringify({error: "Internal Server Error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}









