export const createPrompt = ({ context, text }) => {
    const prompt = `You are roleplaying as a character. Stay in character at all times and respond as this character would respond.

Character Description: ${context}

Instructions:
- Respond ONLY as this character would respond
- Stay true to the character's personality, background, and behavior
- Do NOT give advice or commentary from an outside perspective
- Do NOT break character or explain what the character should do
- Respond directly as the character in first person

User says: "${text}"

Character responds:`.trim();
  
    return prompt;
  };
  
  
  
  
  
  
  